import { v } from "convex/values";
import { internalMutation, internalQuery, mutation, query } from "./_generated/server";
import { requireOwnedObligation, requireProfileId } from "./lib/auth";
import { DocketErrorCodes, docketError } from "./lib/errors";

const statusValidator = v.union(v.literal("open"), v.literal("review"), v.literal("ready"), v.literal("waiting"), v.literal("complete"), v.literal("archived"));

/**
 * Validator for a single validated obligation produced by extraction.
 */
const extractedObligationValidator = v.object({
  title: v.string(),
  actionText: v.string(),
  dueAt: v.union(v.number(), v.null()),
  dueDateText: v.union(v.string(), v.null()),
  dateCertainty: v.union(
    v.literal("exact"),
    v.literal("inferred"),
    v.literal("unresolved"),
    v.literal("none"),
  ),
  ownerLabel: v.union(v.string(), v.null()),
  confidence: v.union(v.literal("high"), v.literal("medium"), v.literal("low")),
  ambiguityNotes: v.union(v.string(), v.null()),
  sourceExcerpt: v.string(),
});

/**
 * Validator for the notes field accompanying an extraction.
 */
const extractionNotesValidator = v.optional(v.string());

/**
 * Returns current docket rows with optional status and due-window filters.
 */
export const listByCurrentUser = query({
  args: {
    status: v.optional(statusValidator),
    dueWindow: v.optional(v.union(v.literal("overdue"), v.literal("sevenDays"), v.literal("thirtyDays"), v.literal("none"))),
    cursor: v.optional(v.string()),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const userId = await requireProfileId(ctx);
    const limit = Math.min(Math.max(args.limit ?? 30, 1), 100);
    let rows = args.status
      ? await ctx.db.query("obligations").withIndex("byUserStatusUpdatedAt", (q) => q.eq("userId", userId).eq("status", args.status!)).collect()
      : await ctx.db.query("obligations").withIndex("byUserDueAt", (q) => q.eq("userId", userId)).collect();
    const now = Date.now();
    const end = args.dueWindow === "sevenDays" ? now + 7 * 86400000 : args.dueWindow === "thirtyDays" ? now + 30 * 86400000 : null;
    if (args.dueWindow === "overdue") rows = rows.filter((row) => row.dueAt !== undefined && row.dueAt < now && row.status !== "complete");
    else if (end !== null) rows = rows.filter((row) => row.dueAt !== undefined && row.dueAt >= now && row.dueAt <= end);
    else if (args.dueWindow === "none") rows = rows.filter((row) => row.dueAt === undefined);
    rows.sort((a, b) => (a.dueAt ?? Number.MAX_SAFE_INTEGER) - (b.dueAt ?? Number.MAX_SAFE_INTEGER) || b.updatedAt - a.updatedAt);
    const offset = args.cursor ? Math.max(rows.findIndex((row) => row._id === args.cursor) + 1, 0) : 0;
    const page = rows.slice(offset, offset + limit);
    return { page, continueCursor: page.length === limit ? page[page.length - 1]._id : null, isDone: offset + page.length >= rows.length };
  },
});

/**
 * Returns an owned obligation with its evidence, activity and drafts.
 */
export const getOwnedDetail = query({
  args: { obligationId: v.id("obligations") },
  handler: async (ctx, args) => {
    const obligation = await requireOwnedObligation(ctx, args.obligationId);
    const [evidence, activity, drafts] = await Promise.all([
      ctx.db.query("evidence").withIndex("byObligation", (q) => q.eq("obligationId", obligation._id)).collect(),
      ctx.db.query("activityEvents").withIndex("byObligationCreatedAt", (q) => q.eq("obligationId", obligation._id)).collect(),
      ctx.db.query("emailDrafts").withIndex("byObligation", (q) => q.eq("obligationId", obligation._id)).collect(),
    ]);
    return { obligation, evidence, activity: activity.sort((a, b) => a.createdAt - b.createdAt), drafts: drafts.sort((a, b) => b.updatedAt - a.updatedAt) };
  },
});

/**
 * Returns an obligation by id for internal use. Scheduled verification runs
 * without a user identity, so ownership is not checked here.
 */
export const getInternal = internalQuery({
  args: { obligationId: v.id("obligations") },
  handler: async (ctx, args) => await ctx.db.get(args.obligationId),
});

/**
 * Updates editable review fields on an owned obligation.
 */
export const updateReview = mutation({
  args: { obligationId: v.id("obligations"), title: v.optional(v.string()), actionText: v.optional(v.string()), dueAt: v.optional(v.union(v.number(), v.null())), dueDateText: v.optional(v.union(v.string(), v.null())), dateCertainty: v.optional(v.union(v.literal("exact"), v.literal("inferred"), v.literal("unresolved"), v.literal("none"))), ownerLabel: v.optional(v.union(v.string(), v.null())), ambiguityNotes: v.optional(v.union(v.string(), v.null())) },
  handler: async (ctx, args) => {
    const obligation = await requireOwnedObligation(ctx, args.obligationId);
    if (obligation.status === "complete" || obligation.status === "archived") docketError(DocketErrorCodes.INVALID_TRANSITION, "Reopen this obligation before editing it.", false);
    const patch: Record<string, string | number | undefined> = { updatedAt: Date.now() };
    if (args.title !== undefined) patch.title = args.title.trim().slice(0, 120);
    if (args.actionText !== undefined) patch.actionText = args.actionText.trim().slice(0, 500);
    if (args.dueAt !== undefined) patch.dueAt = args.dueAt ?? undefined;
    if (args.dueDateText !== undefined) patch.dueDateText = args.dueDateText?.trim().slice(0, 120) || undefined;
    if (args.dateCertainty !== undefined) patch.dateCertainty = args.dateCertainty;
    if (args.ownerLabel !== undefined) patch.ownerLabel = args.ownerLabel?.trim().slice(0, 80) || undefined;
    if (args.ambiguityNotes !== undefined) patch.ambiguityNotes = args.ambiguityNotes?.trim().slice(0, 300) || undefined;
    await ctx.db.patch(obligation._id, patch);
    await ctx.db.insert("activityEvents", { userId: obligation.userId, noticeId: obligation.noticeId, obligationId: obligation._id, kind: "obligation.edited", label: "Obligation reviewed", createdAt: Date.now() });
    return obligation._id;
  },
});

/**
 * Moves an owned obligation through an allowed state transition.
 */
export const setStatus = mutation({
  args: { obligationId: v.id("obligations"), status: statusValidator },
  handler: async (ctx, args) => {
    const obligation = await requireOwnedObligation(ctx, args.obligationId);
    const transitions: Record<string, string[]> = { open: ["review", "ready", "waiting", "complete", "archived"], review: ["open", "ready", "waiting", "complete", "archived"], ready: ["open", "review", "waiting", "complete", "archived"], waiting: ["open", "review", "ready", "complete", "archived"], complete: ["open", "archived"], archived: ["open"] };
    if (!transitions[obligation.status].includes(args.status)) docketError(DocketErrorCodes.INVALID_TRANSITION, `An obligation cannot move from ${obligation.status} to ${args.status}.`, false);
    const now = Date.now();
    await ctx.db.patch(obligation._id, { status: args.status, updatedAt: now, completedAt: args.status === "complete" ? now : undefined });
    await ctx.db.insert("activityEvents", { userId: obligation.userId, noticeId: obligation.noticeId, obligationId: obligation._id, kind: "obligation.statusChanged", label: args.status === "complete" ? "Obligation completed" : `Status changed to ${args.status}`, metadata: { previousStatus: obligation.status, status: args.status }, createdAt: now });
    return obligation._id;
  },
});

/**
 * Persists obligations produced by extraction as `review` rows and records
 * intake activity. Called by the `processing.extractNotice` internal action
 * after the model output has been validated.
 */
export const createFromExtraction = internalMutation({
  args: {
    noticeId: v.id("notices"),
    obligations: v.array(extractedObligationValidator),
    notes: extractionNotesValidator,
  },
  handler: async (ctx, args) => {
    const notice = await ctx.db.get(args.noticeId);
    if (!notice) return [];
    const now = Date.now();
    const obligationIds: string[] = [];
    for (const item of args.obligations) {
      const obligationId = await ctx.db.insert("obligations", {
        userId: notice.userId,
        noticeId: notice._id,
        title: item.title,
        actionText: item.actionText,
        status: "review",
        dueAt: item.dueAt ?? undefined,
        dueDateText: item.dueDateText ?? undefined,
        dateCertainty: item.dateCertainty,
        ownerLabel: item.ownerLabel ?? undefined,
        confidence: item.confidence,
        ambiguityNotes: item.ambiguityNotes ?? undefined,
        sourceExcerpt: item.sourceExcerpt,
        createdAt: now,
        updatedAt: now,
      });
      await ctx.db.insert("activityEvents", {
        userId: notice.userId,
        noticeId: notice._id,
        obligationId,
        kind: "obligation.created",
        label: "Obligation extracted",
        metadata: { confidence: item.confidence, ...(args.notes ? { notes: args.notes } : {}) },
        createdAt: now,
      });
      obligationIds.push(obligationId);
    }
    return obligationIds;
  },
});
