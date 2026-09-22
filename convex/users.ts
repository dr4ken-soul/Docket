import { mutation, query } from "./_generated/server";
import { ensureUser, profileIdForQuery, requireIdentity } from "./lib/auth";

/**
 * Returns the current product profile without provider identity data.
 */
export const current = query({
  args: {},
  handler: async (ctx) => {
    await requireIdentity(ctx);
    const userId = await profileIdForQuery(ctx);
    return userId ? await ctx.db.get(userId) : null;
  },
});

/**
 * Creates the current user's product profile after sign-in when needed.
 */
export const ensureCurrent = mutation({
  args: {},
  handler: async (ctx) => {
    const userId = await ensureUser(ctx);
    return await ctx.db.get(userId);
  },
});
