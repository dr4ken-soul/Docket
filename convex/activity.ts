import { v } from "convex/values";
import { query } from "./_generated/server";
import { requireOwnedObligation } from "./lib/auth";

/**
 * Returns recent activity for an owned obligation in chronological order.
 */
export const listForOwnedObligation = query({
  args: { obligationId: v.id("obligations"), limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    await requireOwnedObligation(ctx, args.obligationId);
    const limit = Math.min(Math.max(args.limit ?? 50, 1), 100);
    const events = await ctx.db
      .query("activityEvents")
      .withIndex("byObligationCreatedAt", (q) => q.eq("obligationId", args.obligationId))
      .order("desc")
      .take(limit);
    return events.reverse();
  },
});
