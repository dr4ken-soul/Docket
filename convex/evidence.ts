import { v } from "convex/values";
import { internalMutation, query } from "./_generated/server";
import { requireOwnedObligation } from "./lib/auth";

/**
 * Lists evidence belonging to an owned obligation.
 */
export const listForOwnedObligation = query({
  args: { obligationId: v.id("obligations") },
  handler: async (ctx, args) => {
    await requireOwnedObligation(ctx, args.obligationId);
    return await ctx.db.query("evidence").withIndex("byObligation", (q) => q.eq("obligationId", args.obligationId)).collect();
  },
});

/**
 * Creates a pending evidence record before an external source check.
 */
export const createPending = internalMutation({
  args: { obligationId: v.id("obligations"), url: v.optional(v.string()) },
  handler: async (ctx, args) => {
    const obligation = await ctx.db.get(args.obligationId);
    if (!obligation) return null;
    const now = Date.now();
    return await ctx.db.insert("evidence", { userId: obligation.userId, obligationId: obligation._id, verificationState: "pending", url: args.url, createdAt: now, updatedAt: now });
  },
});

/**
 * Records a source verification result while enforcing supported evidence.
 */
export const recordResult = internalMutation({
  args: {
    evidenceId: v.id("evidence"),
    verificationState: v.union(v.literal("supported"), v.literal("partiallySupported"), v.literal("unableToVerify")),
    pageTitle: v.optional(v.string()),
    supportingExcerpt: v.optional(v.string()),
    providerRequestId: v.optional(v.string()),
    failureReason: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const evidence = await ctx.db.get(args.evidenceId);
    if (!evidence) return false;
    const state = args.verificationState === "supported" && !args.supportingExcerpt ? "unableToVerify" : args.verificationState;
    await ctx.db.patch(evidence._id, {
      verificationState: state,
      pageTitle: args.pageTitle?.slice(0, 300),
      supportingExcerpt: args.supportingExcerpt?.slice(0, 500),
      providerRequestId: args.providerRequestId?.slice(0, 200),
      failureReason: args.failureReason?.slice(0, 300),
      retrievedAt: state === "unableToVerify" && !args.pageTitle ? undefined : Date.now(),
      updatedAt: Date.now(),
    });
    await ctx.db.insert("activityEvents", {
      userId: evidence.userId,
      obligationId: evidence.obligationId,
      kind: "evidence.checked",
      label: state === "supported" ? "Source supported" : state === "partiallySupported" ? "Source partly supported" : "Source could not be verified",
      metadata: { verificationState: state },
      createdAt: Date.now(),
    });
    return true;
  },
});
