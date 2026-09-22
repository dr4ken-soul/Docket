/**
 * Minimal AgentMail client for inbox provisioning and approved sends.
 * Keys stay in the Convex environment and never reach the browser.
 */
import { DocketErrorCodes } from "./errors";
import type { DocketErrorCode } from "./errors";

export class AgentMailError extends Error {
  readonly status: number;
  readonly retryable: boolean;

  constructor(message: string, status: number, retryable: boolean) {
    super(message);
    this.name = "AgentMailError";
    this.status = status;
    this.retryable = retryable;
  }
}

const TIMEOUT_MS = 15000;

/**
 * Returns the configured AgentMail API base URL.
 *
 * @returns the base URL
 */
function baseUrl(): string {
  return process.env.AGENTMAIL_BASE_URL ?? "https://api.agentmail.to";
}

/**
 * Posts a JSON body to an AgentMail endpoint with the bearer key.
 *
 * @param path the endpoint path
 * @param body the JSON body
 * @returns the parsed response body
 */
async function postJson(path: string, body: unknown): Promise<Record<string, unknown>> {
  const apiKey = process.env.AGENTMAIL_API_KEY ?? "";
  if (!apiKey) {
    throw new Error("AGENTMAIL_NOT_CONFIGURED");
  }
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  let response: Response;
  try {
    response = await fetch(`${baseUrl()}${path}`, {
      method: "POST",
      headers: {
        authorization: `Bearer ${apiKey}`,
        "content-type": "application/json",
      },
      body: JSON.stringify(body),
      signal: controller.signal,
    });
  } catch {
    if (controller.signal.aborted) {
      throw new AgentMailError("AgentMail did not respond in time.", 408, true);
    }
    throw new AgentMailError("AgentMail could not be reached.", 0, true);
  } finally {
    clearTimeout(timer);
  }
  if (!response.ok) {
    if (response.status === 401 || response.status === 403) {
      throw new AgentMailError("AgentMail rejected the credentials.", response.status, false);
    }
    if (response.status === 429 || response.status >= 500) {
      throw new AgentMailError("AgentMail is busy right now.", response.status, true);
    }
    throw new AgentMailError("AgentMail rejected the request.", response.status, false);
  }
  return (await response.json().catch(() => ({}))) as Record<string, unknown>;
}

/**
 * Creates an AgentMail inbox with the given alias.
 *
 * @param alias the unique intake alias
 * @returns the provider inbox id when one is returned
 */
export async function createInbox(alias: string): Promise<string | null> {
  const data = await postJson("/inboxes", { alias, name: alias });
  return typeof data.id === "string" ? data.id : null;
}

/**
 * Sends a message from an AgentMail inbox.
 *
 * @param alias the sending inbox alias
 * @param to the recipient addresses
 * @param subject the message subject
 * @param content the plain text body
 * @returns the provider message id when the provider returns one
 */
export async function sendInboxMessage(
  alias: string,
  to: string[],
  subject: string,
  content: string,
): Promise<string | null> {
  const data = await postJson(`/inboxes/${encodeURIComponent(alias)}/messages`, {
    to,
    subject,
    content,
    contentType: "text",
  });
  if (typeof data.id === "string") return data.id;
  if (typeof data.messageId === "string") return data.messageId;
  const task = data.task as { id?: string } | undefined;
  return typeof task?.id === "string" ? task.id : null;
}

/**
 * Classifies an AgentMail failure into the Docket error contract shape.
 *
 * @param error the caught error
 * @returns the classified error
 */
export function classifyAgentMailError(
  error: unknown,
): { code: DocketErrorCode; message: string; retryable: boolean } {
  if (error instanceof Error && error.message === "AGENTMAIL_NOT_CONFIGURED") {
    return {
      code: DocketErrorCodes.PROVIDER_NOT_CONFIGURED,
      message: "AgentMail is not configured. Set AGENTMAIL_API_KEY on the deployed project and retry.",
      retryable: true,
    };
  }
  if (error instanceof AgentMailError) {
    if (error.status === 401 || error.status === 403) {
      return {
        code: DocketErrorCodes.PROVIDER_NOT_CONFIGURED,
        message: "AgentMail rejected the credentials. Check AGENTMAIL_API_KEY and retry.",
        retryable: true,
      };
    }
    if (error.status === 0 || error.status === 408 || error.status === 429 || error.status >= 500) {
      return {
        code: DocketErrorCodes.PROVIDER_TIMEOUT,
        message: "AgentMail did not respond in time. The draft is safe and can be retried.",
        retryable: true,
      };
    }
    return {
      code: DocketErrorCodes.SEND_FAILED,
      message: "AgentMail could not send the message. Retry when ready.",
      retryable: true,
    };
  }
  return {
    code: DocketErrorCodes.SEND_FAILED,
    message: "The follow up could not be sent. Retry when ready.",
    retryable: true,
  };
}
