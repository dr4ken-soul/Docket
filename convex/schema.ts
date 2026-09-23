import { authTables } from "@convex-dev/auth/server";
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

const inboxProvider = v.union(v.literal("agentmail"), v.literal("paste"));
const inboxStatus = v.union(v.literal("active"), v.literal("paused"), v.literal("error"));
const processingState = v.union(
  v.literal("received"),
  v.literal("processing"),
  v.literal("complete"),
  v.literal("failed"),
);
const obligationStatus = v.union(
  v.literal("open"),
  v.literal("review"),
  v.literal("ready"),
  v.literal("waiting"),
  v.literal("complete"),
  v.literal("archived"),
);
const dateCertainty = v.union(
  v.literal("exact"),
  v.literal("inferred"),
  v.literal("unresolved"),
  v.literal("none"),
);
const confidence = v.union(v.literal("high"), v.literal("medium"), v.literal("low"));
const verificationState = v.union(
  v.literal("pending"),
  v.literal("supported"),
  v.literal("partiallySupported"),
  v.literal("unableToVerify"),
);
const draftStatus = v.union(
  v.literal("draft"),
  v.literal("approved"),
  v.literal("sending"),
  v.literal("sent"),
  v.literal("failed"),
);

/**
 * Docket's complete Convex data model, including operational tables used for
 * rate limiting and webhook idempotency.
 */
export default defineSchema({
  ...authTables,
  users: defineTable({
    // Convex Auth fields. Keep these fields and indexes when extending the
    // built-in auth users table with Docket's product profile fields.
    name: v.optional(v.string()),
    image: v.optional(v.string()),
    email: v.optional(v.string()),
    emailVerificationTime: v.optional(v.number()),
    phone: v.optional(v.string()),
    phoneVerificationTime: v.optional(v.number()),
    isAnonymous: v.optional(v.boolean()),
    authSubject: v.string(),
    displayName: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("email", ["email"])
    .index("phone", ["phone"])
    .index("byAuthSubject", ["authSubject"]),
  inboxes: defineTable({
    userId: v.id("users"),
    provider: inboxProvider,
    alias: v.string(),
    status: inboxStatus,
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("byUser", ["userId"])
    .index("byAlias", ["alias"]),
  notices: defineTable({
    userId: v.id("users"),
    inboxId: v.id("inboxes"),
    providerMessageId: v.optional(v.string()),
    sourceType: inboxProvider,
    sender: v.optional(v.string()),
    subject: v.string(),
    bodyText: v.string(),
    receivedAt: v.number(),
    processingState,
    processingError: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("byUserUpdatedAt", ["userId", "updatedAt"])
    .index("byProviderMessageId", ["providerMessageId"])
    .index("byUserProcessingState", ["userId", "processingState"]),
  processingRuns: defineTable({
    userId: v.id("users"),
    noticeId: v.id("notices"),
    stage: v.union(
      v.literal("extracting"),
      v.literal("verifying"),
      v.literal("drafting"),
      v.literal("complete"),
      v.literal("failed"),
    ),
    provider: v.union(v.literal("openai"), v.literal("firecrawl"), v.literal("agentmail")),
    providerRequestId: v.optional(v.string()),
    startedAt: v.number(),
    completedAt: v.optional(v.number()),
    errorCode: v.optional(v.string()),
  })
    .index("byNotice", ["noticeId"])
    .index("byUserStartedAt", ["userId", "startedAt"]),
  obligations: defineTable({
    userId: v.id("users"),
    noticeId: v.id("notices"),
    title: v.string(),
    actionText: v.string(),
    status: obligationStatus,
    dueAt: v.optional(v.number()),
    dueDateText: v.optional(v.string()),
    dateCertainty,
    ownerLabel: v.optional(v.string()),
    confidence,
    ambiguityNotes: v.optional(v.string()),
    sourceExcerpt: v.string(),
    createdAt: v.number(),
    updatedAt: v.number(),
    completedAt: v.optional(v.number()),
  })
    .index("byUserStatusUpdatedAt", ["userId", "status", "updatedAt"])
    .index("byUserDueAt", ["userId", "dueAt"])
    .index("byNotice", ["noticeId"]),
  evidence: defineTable({
    userId: v.id("users"),
    obligationId: v.id("obligations"),
    verificationState,
    url: v.optional(v.string()),
    pageTitle: v.optional(v.string()),
    supportingExcerpt: v.optional(v.string()),
    retrievedAt: v.optional(v.number()),
    providerRequestId: v.optional(v.string()),
    failureReason: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("byObligation", ["obligationId"])
    .index("byUserState", ["userId", "verificationState"]),
  emailDrafts: defineTable({
    userId: v.id("users"),
    obligationId: v.id("obligations"),
    to: v.array(v.string()),
    subject: v.string(),
    bodyText: v.string(),
    status: draftStatus,
    providerMessageId: v.optional(v.string()),
    failureReason: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
    sentAt: v.optional(v.number()),
  })
    .index("byUserUpdatedAt", ["userId", "updatedAt"])
    .index("byObligation", ["obligationId"])
    .index("byProviderMessageId", ["providerMessageId"]),
  activityEvents: defineTable({
    userId: v.id("users"),
    noticeId: v.optional(v.id("notices")),
    obligationId: v.optional(v.id("obligations")),
    emailDraftId: v.optional(v.id("emailDrafts")),
    kind: v.string(),
    label: v.string(),
    metadata: v.optional(v.record(v.string(), v.union(v.string(), v.number(), v.boolean(), v.null()))),
    createdAt: v.number(),
  })
    .index("byUserCreatedAt", ["userId", "createdAt"])
    .index("byObligationCreatedAt", ["obligationId", "createdAt"]),
  webhookEvents: defineTable({
    provider: v.literal("agentmail"),
    eventId: v.string(),
    eventType: v.string(),
    createdAt: v.number(),
  }).index("byProviderEventId", ["provider", "eventId"]),
  rateLimits: defineTable({
    userId: v.id("users"),
    operation: v.string(),
    windowStartedAt: v.number(),
    count: v.number(),
  }).index("byUserOperation", ["userId", "operation"]),
});
