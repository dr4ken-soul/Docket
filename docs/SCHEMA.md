# Docket Data Schema

This is the logical schema for Convex. Field names use camelCase. The implementation should use Convex validators and indexes rather than accepting unvalidated objects.

## users

Identity is provided by the selected Convex authentication path. Keep provider identity fields separate from product profile data.

| Field | Type | Required | Notes |
|---|---|---:|---|
| `authSubject` | string | yes | Stable authenticated subject, unique |
| `displayName` | string | no | User chosen display name |
| `createdAt` | number | yes | Unix milliseconds |
| `updatedAt` | number | yes | Unix milliseconds |

Indexes:

- `byAuthSubject` on `authSubject`

## inboxes

| Field | Type | Required | Notes |
|---|---|---:|---|
| `userId` | Id<users> | yes | Owner |
| `provider` | literal | yes | `agentmail` or `paste` |
| `alias` | string | yes | Unique intake alias, never a secret |
| `status` | literal | yes | `active`, `paused`, or `error` |
| `createdAt` | number | yes | Unix milliseconds |
| `updatedAt` | number | yes | Unix milliseconds |

Indexes:

- `byUser` on `userId`
- `byAlias` on `alias`

## notices

| Field | Type | Required | Notes |
|---|---|---:|---|
| `userId` | Id<users> | yes | Owner |
| `inboxId` | Id<inboxes> | yes | Intake source |
| `providerMessageId` | string | no | AgentMail idempotency key |
| `sourceType` | literal | yes | `agentmail` or `paste` |
| `sender` | string | no | Store only as needed for the UI |
| `subject` | string | yes | Original subject or generated paste label |
| `bodyText` | string | yes | Original text, subject to retention policy |
| `receivedAt` | number | yes | Unix milliseconds |
| `processingState` | literal | yes | `received`, `processing`, `complete`, `failed` |
| `processingError` | string | no | Safe user-facing error code or message |
| `createdAt` | number | yes | Unix milliseconds |
| `updatedAt` | number | yes | Unix milliseconds |

Indexes:

- `byUserUpdatedAt` on `userId`, `updatedAt`
- `byProviderMessageId` on `providerMessageId`
- `byUserProcessingState` on `userId`, `processingState`

## processingRuns

| Field | Type | Required | Notes |
|---|---|---:|---|
| `userId` | Id<users> | yes | Owner |
| `noticeId` | Id<notices> | yes | Notice being processed |
| `stage` | literal | yes | `extracting`, `verifying`, `drafting`, `complete`, `failed` |
| `provider` | literal | yes | `openai`, `firecrawl`, or `agentmail` |
| `providerRequestId` | string | no | Safe reconciliation identifier |
| `startedAt` | number | yes | Unix milliseconds |
| `completedAt` | number | no | Unix milliseconds |
| `errorCode` | string | no | Stable internal error code |

Indexes:

- `byNotice` on `noticeId`
- `byUserStartedAt` on `userId`, `startedAt`

## obligations

| Field | Type | Required | Notes |
|---|---|---:|---|
| `userId` | Id<users> | yes | Owner |
| `noticeId` | Id<notices> | yes | Parent notice |
| `title` | string | yes | Short action title |
| `actionText` | string | yes | What the user needs to do |
| `status` | literal | yes | `open`, `review`, `ready`, `waiting`, `complete`, `archived` |
| `dueAt` | number | no | Normalised Unix milliseconds |
| `dueDateText` | string | no | Original or unresolved date text |
| `dateCertainty` | literal | yes | `exact`, `inferred`, `unresolved`, `none` |
| `ownerLabel` | string | no | Suggested responsible person |
| `confidence` | literal | yes | `high`, `medium`, or `low` |
| `ambiguityNotes` | string | no | Explanation of uncertainty |
| `sourceExcerpt` | string | yes | Excerpt from original notice |
| `createdAt` | number | yes | Unix milliseconds |
| `updatedAt` | number | yes | Unix milliseconds |
| `completedAt` | number | no | Unix milliseconds |

Indexes:

- `byUserStatusUpdatedAt` on `userId`, `status`, `updatedAt`
- `byUserDueAt` on `userId`, `dueAt`
- `byNotice` on `noticeId`

## evidence

| Field | Type | Required | Notes |
|---|---|---:|---|
| `userId` | Id<users> | yes | Owner |
| `obligationId` | Id<obligations> | yes | Related obligation |
| `verificationState` | literal | yes | `pending`, `supported`, `partiallySupported`, `unableToVerify` |
| `url` | string | no | Candidate or verified source URL |
| `pageTitle` | string | no | Retrieved page title |
| `supportingExcerpt` | string | no | Relevant Firecrawl excerpt |
| `retrievedAt` | number | no | Unix milliseconds |
| `providerRequestId` | string | no | Firecrawl request identifier |
| `failureReason` | string | no | Safe explanation if unavailable |
| `createdAt` | number | yes | Unix milliseconds |
| `updatedAt` | number | yes | Unix milliseconds |

Indexes:

- `byObligation` on `obligationId`
- `byUserState` on `userId`, `verificationState`

## emailDrafts

| Field | Type | Required | Notes |
|---|---|---:|---|
| `userId` | Id<users> | yes | Owner |
| `obligationId` | Id<obligations> | yes | Related obligation |
| `to` | string[] | yes | User-confirmed recipients |
| `subject` | string | yes | Draft subject |
| `bodyText` | string | yes | Draft body |
| `status` | literal | yes | `draft`, `approved`, `sending`, `sent`, `failed` |
| `providerMessageId` | string | no | AgentMail delivery identifier |
| `failureReason` | string | no | Safe user-facing reason |
| `createdAt` | number | yes | Unix milliseconds |
| `updatedAt` | number | yes | Unix milliseconds |
| `sentAt` | number | no | Unix milliseconds |

Indexes:

- `byUserUpdatedAt` on `userId`, `updatedAt`
- `byObligation` on `obligationId`
- `byProviderMessageId` on `providerMessageId`

## activityEvents

| Field | Type | Required | Notes |
|---|---|---:|---|
| `userId` | Id<users> | yes | Owner |
| `noticeId` | Id<notices> | no | Related notice |
| `obligationId` | Id<obligations> | no | Related obligation |
| `emailDraftId` | Id<emailDrafts> | no | Related draft |
| `kind` | literal | yes | Product event name |
| `label` | string | yes | User-facing event label |
| `metadata` | object | no | Safe non-sensitive metadata only |
| `createdAt` | number | yes | Unix milliseconds |

Indexes:

- `byUserCreatedAt` on `userId`, `createdAt`
- `byObligationCreatedAt` on `obligationId`, `createdAt`

## Invariants

- Every user-owned record must carry `userId`.
- Every obligation belongs to exactly one notice.
- Every evidence record belongs to exactly one obligation.
- A draft may only be sent when the authenticated user explicitly approves it.
- A webhook event may create at most one notice or delivery update.
- A missing evidence record never implies verification.
- Completed obligations remain readable in history until the retention policy removes them.
