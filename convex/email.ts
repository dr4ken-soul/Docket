import { v } from "convex/values";
import { internal } from "./_generated/api";
import { internalAction, internalMutation, internalQuery, mutation, query } from "./_generated/server";
import { requireProfileId, requireOwnedObligation } from "./lib/auth";
import { docketError, DocketErrorCodes } from "./lib/errors";
import { sendInboxMessage, classifyAgentMailError } from "./lib/agentmail";
import { withRetry } from "./lib/retry";

const draftStatusValidator = v.union(
  v.literal("draft"),
  v.literal("approved"),
  v.literal("sending"),
  v.literal("sent"),
  v.literal("failed"),
);

/**
 * Returns drafts owned by the current user, newest first.
 */
export const listByCurrentUser = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const userId = await requireProfileId(ctx);
    const limit = Math.min(Math.max(args.limit ?? 30, 1), 100);
    return await ctx.db
      .query("emailDrafts")
      .withIndex("byUserUpdatedAt", (q) => q.eq("userId", userId))
      .order("desc")
      .take(limit);
  },
});

/**
 * Returns drafts belonging to an owned obligation.
 */
export const listForOwnedObligation = query({
  args: { obligationId: v.id("obligations") },
  handler: async (ctx, args) => {
    await requireOwnedObligation(ctx, args.obligationId);
    return await ctx.db
      .query("emailDrafts")
      .withIndex("byObligation", (q) => q.eq("obligationId", args.obligationId))
      .collect();
  },
});

/**
 * Returns an owned draft by id, or null when the current user does not own it.
 */
export const getOwned = query({
  args: { draftId: v.id("emailDrafts") },
  handler: async (ctx, args) => {
    const userId = await requireProfileId(ctx);
    const draft = await ctx.db.get(args.draftId);
    if (!draft || draft.userId !== userId) {
      return null;
    }
    return draft;
  },
});

/**
 * Returns a draft by id for internal use. Scheduled send flows run without a
 * user identity, so ownership is not checked here.
 */
export const getInternal = internalQuery({
  args: { draftId: v.id("emailDrafts") },
  handler: async (ctx, args) => await ctx.db.get(args.draftId),
});

/**
 * Creates a draft tied to an owned obligation. The draft is never sent until
 * explicitly approved.
 */
export const create = mutation({
  args: {
    obligationId: v.id("obligations"),
    to: v.array(v.string()),
    subject: v.string(),
    bodyText: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await requireProfileId(ctx);
    const obligation = await requireOwnedObligation(ctx, args.obligationId);
    const now = Date.now();
    const draftId = await ctx.db.insert("emailDrafts", {
      userId,
      obligationId: obligation._id,
      to: args.to,
      subject: args.subject.trim().slice(0, 200),
      bodyText: args.bodyText.slice(0, 5000),
      status: "draft",
      createdAt: now,
      updatedAt: now,
    });
    await ctx.db.insert("activityEvents", {
      userId: obligation.userId,
      obligationId: obligation._id,
      emailDraftId: draftId,
      kind: "draft.created",
      label: "Follow-up draft created",
      createdAt: now,
    });
    return draftId;
  },
});

/**
 * Updates an owned draft while its status is `draft`.
 */
export const update = mutation({
  args: {
    draftId: v.id("emailDrafts"),
    to: v.optional(v.array(v.string())),
    subject: v.optional(v.string()),
    bodyText: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await requireProfileId(ctx);
    const draft = await ctx.db.get(args.draftId);
    if (!draft || draft.userId !== userId) {
      docketError(
        DocketErrorCodes.RECORD_NOT_AVAILABLE,
        "This draft is not available.",
        false,
      );
    }
    if (draft.status !== "draft") {
      docketError(
        DocketErrorCodes.INVALID_TRANSITION,
        "Only drafts that are not sent can be edited.",
        false,
      );
    }
    const patch: Record<string, unknown> = { updatedAt: Date.now() };
    if (args.to !== undefined) patch.to = args.to;
    if (args.subject !== undefined) patch.subject = args.subject.trim().slice(0, 200);
    if (args.bodyText !== undefined) patch.bodyText = args.bodyText.slice(0, 5000);
    await ctx.db.patch(args.draftId, patch);
    return args.draftId;
  },
});

/**
 * Moves a draft to `approved` and records the approving user and time.
 */
export const approve = mutation({
  args: { draftId: v.id("emailDrafts") },
  handler: async (ctx, args) => {
    const userId = await requireProfileId(ctx);
    const draft = await ctx.db.get(args.draftId);
    if (!draft || draft.userId !== userId) {
      docketError(
        DocketErrorCodes.RECORD_NOT_AVAILABLE,
        "This draft is not available.",
        false,
      );
    }
    if (draft.status !== "draft") {
      docketError(
        DocketErrorCodes.INVALID_TRANSITION,
        "Only drafts that are not sent can be approved.",
        false,
      );
    }
    const now = Date.now();
    await ctx.db.patch(args.draftId, { status: "approved", updatedAt: now });
    await ctx.db.insert("activityEvents", {
      userId,
      obligationId: draft.obligationId,
      emailDraftId: args.draftId,
      kind: "draft.approved",
      label: "Follow-up approved",
      metadata: { approvedBy: userId },
      createdAt: now,
    });
    await ctx.scheduler.runAfter(0, internal.email.sendApprovedDraft, {
      draftId: args.draftId,
    });
    return args.draftId;
  },
});

/**
 * Claims an approved draft for a single send attempt, preventing duplicate
 * sends. Returns null when the draft has already moved past `approved`.
 */
export const markSending = internalMutation({
  args: { draftId: v.id("emailDrafts") },
  handler: async (ctx, args) => {
    const draft = await ctx.db.get(args.draftId);
    if (!draft || draft.status !== "approved") {
      return null;
    }
    await ctx.db.patch(args.draftId, { status: "sending", updatedAt: Date.now() });
    return args.draftId;
  },
});

/**
 * Records the delivery result of a send attempt as `sent` or `failed`.
 */
export const recordDelivery = internalMutation({
  args: {
    draftId: v.id("emailDrafts"),
    status: draftStatusValidator,
    providerMessageId: v.optional(v.string()),
    failureReason: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const draft = await ctx.db.get(args.draftId);
    if (!draft) return false;
    const now = Date.now();
    await ctx.db.patch(args.draftId, {
      status: args.status,
      providerMessageId: args.providerMessageId,
      failureReason: args.failureReason,
      updatedAt: now,
      sentAt: args.status === "sent" ? now : draft.sentAt,
    });
    await ctx.db.insert("activityEvents", {
      userId: draft.userId,
      obligationId: draft.obligationId,
      emailDraftId: args.draftId,
      kind:
        args.status === "sent"
          ? "draft.sent"
          : args.status === "failed"
            ? "draft.failed"
            : "draft.updated",
      label:
        args.status === "sent"
          ? "Follow-up sent"
          : args.status === "failed"
            ? "Follow-up failed"
            : "Follow-up updated",
      metadata: { status: args.status },
      createdAt: now,
    });
    return true;
  },
});

type DraftStatus = "draft" | "approved" | "sending" | "sent" | "failed";

/**
 * Internal mutation that applies an AgentMail delivery webhook event to the
 * matching draft. Deduplicates by provider event id so a replayed webhook
 * does not write duplicate state, and maps provider statuses (`sent`,
 * `delivered`, `bounced`, `failed`) onto Docket's draft statuses.
 */
export const recordDeliveryByMessageId = internalMutation({
  args: {
    providerMessageId: v.string(),
    webhookStatus: v.string(),
    providerEventId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("webhookEvents")
      .withIndex("byProviderEventId", (q) =>
        q
          .eq("provider", "agentmail")
          .eq("eventId", args.providerEventId ?? ""),
      )
      .first();
    if (existing) return { applied: false, drafts: 0 };

    const mapped: DraftStatus | null =
      args.webhookStatus === "sent" || args.webhookStatus === "delivered"
        ? "sent"
        : args.webhookStatus === "bounced" || args.webhookStatus === "failed"
          ? "failed"
          : null;

    if (mapped === null) {
      await ctx.db.insert("webhookEvents", {
        provider: "agentmail",
        eventId: args.providerEventId ?? "",
        eventType: args.webhookStatus,
        createdAt: Date.now(),
      });
      return { applied: true, drafts: 0 };
    }

    const drafts = await ctx.db
      .query("emailDrafts")
      .withIndex("byProviderMessageId", (q) =>
        q.eq("providerMessageId", args.providerMessageId),
      )
      .collect();
    for (const draft of drafts) {
      if (draft.status === "sent" || draft.status === "failed") continue;
      await ctx.db.patch(draft._id, {
        status: mapped,
        updatedAt: Date.now(),
        sentAt: mapped === "sent" ? Date.now() : draft.sentAt,
      });
      await ctx.db.insert("activityEvents", {
        userId: draft.userId,
        noticeId: undefined,
        obligationId: draft.obligationId,
        emailDraftId: draft._id,
        kind: mapped === "sent" ? "draft.sent" : "draft.failed",
        label: mapped === "sent" ? "Follow-up sent" : "Follow-up failed",
        metadata: {
          ...(args.providerEventId
            ? { providerEventId: args.providerEventId }
            : {}),
          webhookStatus: args.webhookStatus,
        },
        createdAt: Date.now(),
      });
    }
    await ctx.db.insert("webhookEvents", {
      provider: "agentmail",
      eventId: args.providerEventId ?? "",
      eventType: args.webhookStatus,
      createdAt: Date.now(),
    });
    return { applied: true, drafts: drafts.length };
  },
});

/**
 * Internal action that sends an approved draft through AgentMail. Claims the
 * draft via `markSending` first to prevent duplicate sends, then records the
 * delivery result. Only ever runs after explicit user approval.
 */
export const sendApprovedDraft = internalAction({
  args: { draftId: v.id("emailDrafts") },
  handler: async (
    ctx,
    args,
  ): Promise<
    | { sent: true; providerMessageId: string | null }
    | { sent: false; reason: string }
    | { sent: false; error: string }
  > => {
    const claimed = await ctx.runMutation(internal.email.markSending, {
      draftId: args.draftId,
    });
    if (!claimed) {
      return { sent: false as const, reason: "not approved" };
    }
    const draft = await ctx.runQuery(internal.email.getInternal, {
      draftId: args.draftId,
    });
    if (!draft) {
      return { sent: false as const, reason: "not found" };
    }
    const inbox = await ctx.runQuery(internal.inboxes.getByUserInternal, {
      userId: draft.userId,
    });
    if (!inbox) {
      await ctx.runMutation(internal.email.recordDelivery, {
        draftId: args.draftId,
        status: "failed",
        failureReason: "No AgentMail inbox is configured.",
      });
      return { sent: false as const, error: "No AgentMail inbox is configured." };
    }
    try {
      const providerMessageId = await withRetry(
        () =>
          sendInboxMessage(
            inbox.alias,
            draft.to,
            draft.subject,
            draft.bodyText,
          ),
        3,
      );
      await ctx.runMutation(internal.email.recordDelivery, {
        draftId: args.draftId,
        status: "sent",
        providerMessageId: providerMessageId ?? undefined,
      });
      return { sent: true, providerMessageId: providerMessageId ?? null };
    } catch (error) {
      const classified = classifyAgentMailError(error);
      await ctx.runMutation(internal.email.recordDelivery, {
        draftId: args.draftId,
        status: "failed",
        failureReason: classified.message,
      });
      return { sent: false as const, error: classified.message };
    }
  },
});
