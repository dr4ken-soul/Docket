import { httpAction } from "./_generated/server";
import { httpRouter } from "convex/server";
import { internal } from "./_generated/api";

const WEBHOOK_PATH = "/webhooks/agentmail";

/**
 * Verifies an AgentMail webhook HMAC signature against the raw request body
 * using AGENTMAIL_WEBHOOK_SECRET. Rejects when no secret or signature is
 * present, so a misconfigured deployment cannot accept forged traffic.
 */
async function verifySignature(
  body: ArrayBuffer,
  signature: string | null,
): Promise<boolean> {
  const secret = process.env.AGENTMAIL_WEBHOOK_SECRET;
  if (!secret || !signature) {
    return false;
  }
  const crypto = globalThis.crypto;
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: { name: "SHA-256" } },
    false,
    ["sign"],
  );
  const digest = await crypto.subtle.sign("HMAC", key, body);
  const computed = Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  const expected = signature.replace(/^sha256=/i, "").toLowerCase();
  if (computed.length !== expected.length) {
    return false;
  }
  let diff = 0;
  for (let i = 0; i < computed.length; i++) {
    diff |= computed.charCodeAt(i) ^ expected.charCodeAt(i);
  }
  return diff === 0;
}

/**
 * Returns the configured webhook path prefix.
 */
function webhookPrefix(): string {
  return process.env.WEBHOOK_PREFIX ?? "";
}

/**
 * Inbound AgentMail webhook. Verifies the signature, deduplicates by provider
 * event id, and schedules notice processing. Responds with a minimal payload
 * that never includes notice body content.
 */
export const inbound = httpAction(async (ctx, request) => {
  const signature = request.headers.get("X-AgentMail-Signature");
  const body = await request.arrayBuffer();
  const ok = await verifySignature(body, signature);
  if (!ok) {
    return new Response(JSON.stringify({ accepted: false }), {
      status: 401,
      headers: { "content-type": "application/json" },
    });
  }
  let payload: unknown;
  try {
    payload = JSON.parse(new TextDecoder().decode(body));
  } catch {
    return new Response(JSON.stringify({ accepted: false }), {
      status: 400,
      headers: { "content-type": "application/json" },
    });
  }
  const data = payload as Record<string, unknown>;
  const eventId = typeof data.eventId === "string" ? data.eventId : "";
  const messageId = typeof data.messageId === "string" ? data.messageId : "";
  const alias = typeof data.alias === "string" ? data.alias : "";
  const sender = typeof data.sender === "string" ? data.sender : undefined;
  const subject = typeof data.subject === "string" ? data.subject : "";
  const bodyText = typeof data.bodyText === "string" ? data.bodyText : "";
  const receivedAt =
    typeof data.receivedAt === "number"
      ? (data.receivedAt as number)
      : Date.now();

  await ctx.runMutation(internal.notices.acceptInbound, {
    eventId,
    messageId,
    alias,
    sender,
    subject,
    bodyText,
    receivedAt,
  });
  return new Response(JSON.stringify({ accepted: true }), {
    headers: { "content-type": "application/json" },
  });
});

/**
 * Delivery AgentMail webhook. Verifies the signature and records sent,
 * delivered, bounced, or failed delivery state by provider message id.
 */
export const delivery = httpAction(async (ctx, request) => {
  const signature = request.headers.get("X-AgentMail-Signature");
  const body = await request.arrayBuffer();
  const ok = await verifySignature(body, signature);
  if (!ok) {
    return new Response(JSON.stringify({ accepted: false }), {
      status: 401,
      headers: { "content-type": "application/json" },
    });
  }
  let payload: unknown;
  try {
    payload = JSON.parse(new TextDecoder().decode(body));
  } catch {
    return new Response(JSON.stringify({ accepted: false }), {
      status: 400,
      headers: { "content-type": "application/json" },
    });
  }
  const data = payload as Record<string, unknown>;
  const eventId = typeof data.eventId === "string" ? data.eventId : "";
  const messageId = typeof data.messageId === "string" ? data.messageId : "";
  const status = typeof data.status === "string" ? data.status : "";

  const applied = await ctx.runMutation(internal.email.recordDeliveryByMessageId, {
    providerMessageId: messageId,
    webhookStatus: status,
    providerEventId: eventId,
  });
  return new Response(JSON.stringify({ accepted: true, applied }), {
    headers: { "content-type": "application/json" },
  });
});

/**
 * Service health check.
 */
export const health = httpAction(async () => {
  return new Response(JSON.stringify({ status: "ok" }), {
    headers: { "content-type": "application/json" },
  });
});

const http = httpRouter();

http.route({
  method: "POST",
  path: `${webhookPrefix()}${WEBHOOK_PATH}/inbound`,
  handler: inbound,
});
http.route({
  method: "POST",
  path: `${webhookPrefix()}${WEBHOOK_PATH}/delivery`,
  handler: delivery,
});
http.route({ method: "GET", path: "/health", handler: health });

export default http;
