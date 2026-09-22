import { v } from "convex/values";
import { internalQuery, mutation, query } from "./_generated/server";
import { requireProfileId } from "./lib/auth";
import { DocketErrorCodes, docketError } from "./lib/errors";

/**
 * Normalises an inbox alias to its safe local form.
 */
function normaliseAlias(value: string): string {
  return value.trim().toLowerCase().replace(/[^a-z0-9._-]/g, "-").replace(/-+/g, "-").slice(0, 64);
}

/**
 * Returns all inboxes owned by the current user.
 */
export const byCurrentUser = query({
  args: {},
  handler: async (ctx) => {
    const userId = await requireProfileId(ctx);
    return await ctx.db.query("inboxes").withIndex("byUser", (q) => q.eq("userId", userId)).collect();
  },
});

/**
 * Returns the agentmail inbox for a user, for internal send flows. Scheduled
 * actions run without a user identity, so ownership is checked against the
 * supplied user id rather than the caller identity.
 */
export const getByUserInternal = internalQuery({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const inboxes = await ctx.db
      .query("inboxes")
      .withIndex("byUser", (q) => q.eq("userId", args.userId))
      .collect();
    return inboxes.find((inbox) => inbox.provider === "agentmail") ?? null;
  },
});

/**
 * Creates a user-owned intake record after checking alias uniqueness.
 */
export const create = mutation({
  args: {
    provider: v.union(v.literal("agentmail"), v.literal("paste")),
    alias: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await requireProfileId(ctx);
    const alias = normaliseAlias(args.alias);
    if (alias.length < 3) {
      docketError(DocketErrorCodes.INVALID_INPUT, "Use an inbox alias with at least three characters.", false);
    }
    const existing = await ctx.db.query("inboxes").withIndex("byAlias", (q) => q.eq("alias", alias)).unique();
    if (existing) {
      if (existing.userId === userId && existing.provider === args.provider) return existing._id;
      docketError(DocketErrorCodes.INVALID_INPUT, "That inbox alias is not available.", false);
    }
    const now = Date.now();
    return await ctx.db.insert("inboxes", {
      userId,
      provider: args.provider,
      alias,
      status: "active",
      createdAt: now,
      updatedAt: now,
    });
  },
});
