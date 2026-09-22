import type { MutationCtx } from "./_generated/server";
import { v } from "convex/values";
import { internal } from "./_generated/api";
import { internalMutation, internalQuery, mutation, query } from "./_generated/server";
import { requireOwnedNotice, requireProfileId } from "./lib/auth";
import { DocketErrorCodes, docketError } from "./lib/errors";

const MAX_SUBJECT_LENGTH = 200;
const MAX_BODY_LENGTH = 50000;
const PASTE_LIMIT = 20;
const HOUR_MS = 60 * 60 * 1000;

/**
 * Trims and bounds user supplied text.
 */
function boundedText(value: string, maximum: number): string {
  return value.trim().slice(0, maximum);
}

/**
 * Returns notices owned by the current user, newest first.
 */
export const listByCurrentUser = query({
  args: {
    processingState: v.optional(v.union(v.literal("received"), v.literal("processing"), v.literal("complete"), v.literal("failed"))),
    cursor: v.optional(v.string()),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const userId = await requireProfileId(ctx);
    const limit = Math.min(Math.max(args.limit ?? 20, 1), 100);
    const records = args.processingState
      ? await ctx.db.query("notices").withIndex("byUserProcessingState", (q) => q.eq("userId", userId).eq("processingState", args.processingState!)).collect()
      : await ctx.db.query("notices").withIndex("byUserUpdatedAt", (q) => q.eq("userId", userId)).order("desc").collect();
    const sorted = records.sort((a, b) => b.updatedAt - a.updatedAt || b._creationTime - a._creationTime);
    const offset = args.cursor ? Math.max(sorted.findIndex((item) => item._id === args.cursor) + 1, 0) : 0;
    const page = sorted.slice(offset, offset + limit);
    return { page, continueCursor: page.length === limit ? page[page.length - 1]._id : null, isDone: offset + page.length >= sorted.length };
  },
});

/**
 * Returns a notice only when it belongs to the current user.
 */
export const getOwned = query({
  args: { noticeId: v.id("notices") },
  handler: async (ctx, args) => await requireOwnedNotice(ctx, args.noticeId),
});

/**
 * Returns a notice by id for internal use. Scheduled processing runs without a
 * user identity, so ownership is not checked here.
 */
export const getInternal = internalQuery({
  args: { noticeId: v.id("notices") },
  handler: async (ctx, args) => await ctx.db.get(args.noticeId),
});

/**
 * Creates the current user's paste inbox when it does not exist.
 */
async function getOrCreatePasteInbox(
  ctx: MutationCtx,
  userId: never,
) {
  const inboxes = await ctx.db.query("inboxes").withIndex("byUser", (q) => q.eq("userId", userId)).collect();
  const existing = inboxes.find((inbox) => inbox.provider === "paste");
  if (existing) return existing._id;
  const now = Date.now();
  return await ctx.db.insert("inboxes", {
    userId,
    provider: "paste",
    alias: `paste-${String(userId)}`,
    status: "active",
    createdAt: now,
    updatedAt: now,
  });
}

/**
 * Applies the per-user hourly paste intake limit atomically.
 */
async function enforcePasteAllowance(
  ctx: MutationCtx,
  userId: never,
): Promise<void> {
  const now = Date.now();
  const record = await ctx.db.query("rateLimits").withIndex("byUserOperation", (q) => q.eq("userId", userId).eq("operation", "pasteIntake")).unique();
  if (!record || now - record.windowStartedAt >= HOUR_MS) {
    if (record) await ctx.db.patch(record._id, { windowStartedAt: now, count: 1 });
    else await ctx.db.insert("rateLimits", { userId, operation: "pasteIntake", windowStartedAt: now, count: 1 });
    return;
  }
  if (record.count >= PASTE_LIMIT) {
    docketError(DocketErrorCodes.RATE_LIMITED, "Paste intake is limited to 20 notices per hour. Try again later.", true);
  }
  await ctx.db.patch(record._id, { count: record.count + 1 });
}

/**
 * Creates a pasted notice, records intake and schedules extraction.
 */
export const createFromPaste = mutation({
  args: { subject: v.string(), bodyText: v.string() },
  handler: async (ctx, args) => {
    const userId = await requireProfileId(ctx);
    const subject = boundedText(args.subject, MAX_SUBJECT_LENGTH) || "Pasted notice";
    const bodyText = boundedText(args.bodyText, MAX_BODY_LENGTH);
    if (!bodyText) docketError(DocketErrorCodes.INVALID_INPUT, "Paste the notice text before continuing.", false);
    await enforcePasteAllowance(ctx, userId as never);
    const inboxId = await getOrCreatePasteInbox(ctx, userId as never);
    const now = Date.now();
    const noticeId = await ctx.db.insert("notices", {
      userId,
      inboxId,
      sourceType: "paste",
      subject,
      bodyText,
      receivedAt: now,
      processingState: "received",
      createdAt: now,
      updatedAt: now,
    });
    await ctx.db.insert("activityEvents", { userId, noticeId, kind: "notice.received", label: "Notice received", metadata: { sourceType: "paste" }, createdAt: now });
    await ctx.scheduler.runAfter(0, internal.processing.extractNotice, { noticeId });
    return noticeId;
  },
});

/**
 * Applies a valid internal notice processing transition.
 */
export const updateProcessingState = internalMutation({
  args: {
    noticeId: v.id("notices"),
    state: v.union(v.literal("received"), v.literal("processing"), v.literal("complete"), v.literal("failed")),
    error: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const notice = await ctx.db.get(args.noticeId);
    if (!notice) return false;
    const allowed = { received: ["processing", "failed"], processing: ["complete", "failed"], complete: ["processing"], failed: ["processing"] } as const;
    if (!(allowed[notice.processingState] as readonly string[]).includes(args.state)) return false;
    await ctx.db.patch(notice._id, { processingState: args.state, processingError: args.error, updatedAt: Date.now() });
    return true;
  },
});

/**
 * Atomically records an inbound webhook and creates at most one notice.
 */
export const acceptInbound = internalMutation({
  args: { eventId: v.string(), messageId: v.string(), alias: v.string(), sender: v.optional(v.string()), subject: v.string(), bodyText: v.string(), receivedAt: v.number() },
  handler: async (ctx, args) => {
    const priorEvent = await ctx.db.query("webhookEvents").withIndex("byProviderEventId", (q) => q.eq("provider", "agentmail").eq("eventId", args.eventId)).unique();
    if (priorEvent) return { duplicate: true as const };
    const priorMessage = await ctx.db.query("notices").withIndex("byProviderMessageId", (q) => q.eq("providerMessageId", args.messageId)).unique();
    await ctx.db.insert("webhookEvents", { provider: "agentmail", eventId: args.eventId, eventType: "inbound", createdAt: Date.now() });
    if (priorMessage) return { duplicate: true as const };
    const inbox = await ctx.db.query("inboxes").withIndex("byAlias", (q) => q.eq("alias", args.alias.toLowerCase())).unique();
    if (!inbox || inbox.provider !== "agentmail" || inbox.status !== "active") return { unknownAlias: true as const };
    const now = Date.now();
    const noticeId = await ctx.db.insert("notices", {
      userId: inbox.userId,
      inboxId: inbox._id,
      providerMessageId: args.messageId,
      sourceType: "agentmail",
      sender: args.sender?.slice(0, 320),
      subject: boundedText(args.subject, MAX_SUBJECT_LENGTH) || "Forwarded notice",
      bodyText: boundedText(args.bodyText, MAX_BODY_LENGTH),
      receivedAt: args.receivedAt,
      processingState: "received",
      createdAt: now,
      updatedAt: now,
    });
    await ctx.db.insert("activityEvents", { userId: inbox.userId, noticeId, kind: "notice.received", label: "Notice received", metadata: { sourceType: "agentmail" }, createdAt: now });
    await ctx.scheduler.runAfter(0, internal.processing.extractNotice, { noticeId });
    return { noticeId };
  },
});
