/**
 * Identity and ownership helpers shared by Docket Convex functions.
 */
import type {
  QueryCtx,
  MutationCtx,
} from "../_generated/server";
import type { GenericId } from "convex/values";
import type { Doc } from "../_generated/dataModel";
import { DocketErrorCodes, docketError } from "./errors";

/**
 * Any function context that can read data and carry an identity.
 */
export type ReadCtx = QueryCtx | MutationCtx;

/**
 * Contexts whose database handle can write.
 */
type WriteCtx = MutationCtx;

/**
 * Returns the authenticated user identity for this request.
 *
 * @param ctx the function context
 * @returns the authenticated identity
 */
export async function requireIdentity(ctx: ReadCtx) {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) {
    docketError(DocketErrorCodes.AUTH_REQUIRED, "Sign in to use Docket.", false);
  }
  return identity;
}

/**
 * Runtime check for contexts that can write to the database.
 *
 * @param ctx the function context
 * @returns true when the context database handle can insert rows
 */
function canWrite(ctx: ReadCtx): ctx is WriteCtx {
  return typeof (ctx.db as { insert?: unknown }).insert === "function";
}

/**
 * Looks up the product profile for the authenticated user, creating it on
 * first use.
 *
 * @param ctx a context that can write
 * @returns the users document id
 */
async function lookupOrCreateProfile(
  ctx: WriteCtx,
): Promise<GenericId<"users">> {
  const identity = await requireIdentity(ctx);
  const existing = await ctx.db
    .query("users")
    .withIndex("byAuthSubject", (q) => q.eq("authSubject", identity.tokenIdentifier))
    .unique();
  if (existing) {
    return existing._id;
  }
  const now = Date.now();
  return await ctx.db.insert("users", {
    authSubject: identity.tokenIdentifier,
    displayName: identity.name ?? undefined,
    createdAt: now,
    updatedAt: now,
  });
}

/**
 * Returns the product profile id for the authenticated user, creating the
 * profile row on first use when the context can write.
 *
 * @param ctx the function context
 * @returns the users document id
 */
export async function requireProfileId(ctx: ReadCtx): Promise<GenericId<"users">> {
  const identity = await requireIdentity(ctx);
  const existing = await ctx.db
    .query("users")
    .withIndex("byAuthSubject", (q) => q.eq("authSubject", identity.tokenIdentifier))
    .unique();
  if (existing) {
    return existing._id;
  }
  if (!canWrite(ctx)) {
    docketError(
      DocketErrorCodes.AUTH_REQUIRED,
      "Your Docket profile is not ready yet. Sign in again.",
      false,
    );
  }
  return await lookupOrCreateProfile(ctx);
}

/**
 * Returns the product profile id for read-only contexts, or null when the
 * user is not signed in or the profile row has not been created yet.
 *
 * @param ctx a query context
 * @returns the users document id or null
 */
export async function profileIdForQuery(
  ctx: QueryCtx,
): Promise<GenericId<"users"> | null> {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) {
    return null;
  }
  const user = await ctx.db
    .query("users")
    .withIndex("byAuthSubject", (q) => q.eq("authSubject", identity.tokenIdentifier))
    .unique();
  return user ? user._id : null;
}

/**
 * Creates or returns the product profile for the authenticated user.
 * Mutation-only variant used by sign-in flows.
 *
 * @param ctx a mutation context
 * @returns the users document id
 */
export async function ensureUser(
  ctx: MutationCtx,
): Promise<GenericId<"users">> {
  return await lookupOrCreateProfile(ctx);
}

/**
 * Returns the notice only if it belongs to the authenticated user.
 *
 * @param ctx the function context
 * @param noticeId the notice to check
 * @returns the notice document
 */
export async function requireOwnedNotice(
  ctx: ReadCtx,
  noticeId: GenericId<"notices">,
): Promise<Doc<"notices">> {
  const profileId = await requireProfileId(ctx);
  const notice = await ctx.db.get(noticeId);
  if (!notice || notice.userId !== profileId) {
    docketError(
      DocketErrorCodes.RECORD_NOT_AVAILABLE,
      "This notice is not available.",
      false,
    );
  }
  return notice;
}

/**
 * Returns the obligation only if it belongs to the authenticated user.
 *
 * @param ctx the function context
 * @param obligationId the obligation to check
 * @returns the obligation document
 */
export async function requireOwnedObligation(
  ctx: ReadCtx,
  obligationId: GenericId<"obligations">,
): Promise<Doc<"obligations">> {
  const profileId = await requireProfileId(ctx);
  const obligation = await ctx.db.get(obligationId);
  if (!obligation || obligation.userId !== profileId) {
    docketError(
      DocketErrorCodes.RECORD_NOT_AVAILABLE,
      "This obligation is not available.",
      false,
    );
  }
  return obligation;
}

/**
 * Returns the email draft only if it belongs to the authenticated user.
 *
 * @param ctx the function context
 * @param draftId the draft to check
 * @returns the draft document
 */
export async function requireOwnedDraft(
  ctx: ReadCtx,
  draftId: GenericId<"emailDrafts">,
): Promise<Doc<"emailDrafts">> {
  const profileId = await requireProfileId(ctx);
  const draft = await ctx.db.get(draftId);
  if (!draft || draft.userId !== profileId) {
    docketError(
      DocketErrorCodes.RECORD_NOT_AVAILABLE,
      "This draft is not available.",
      false,
    );
  }
  return draft;
}

/**
 * Returns the inbox only if it belongs to the authenticated user.
 *
 * @param ctx the function context
 * @param inboxId the inbox to check
 * @returns the inbox document
 */
export async function requireOwnedInbox(
  ctx: ReadCtx,
  inboxId: GenericId<"inboxes">,
): Promise<Doc<"inboxes">> {
  const profileId = await requireProfileId(ctx);
  const inbox = await ctx.db.get(inboxId);
  if (!inbox || inbox.userId !== profileId) {
    docketError(
      DocketErrorCodes.RECORD_NOT_AVAILABLE,
      "This inbox is not available.",
      false,
    );
  }
  return inbox;
}
