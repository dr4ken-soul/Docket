# Docket Routes and Convex Functions

This file describes the application boundary. The first implementation should prefer Convex queries, mutations, and actions over a separate REST server. HTTP routes are reserved for provider webhooks and hosting health checks.

## Frontend routes

| Route | Access | Purpose |
|---|---|---|
| `/` | public | Landing page and sample workflow |
| `/sign-in` | public | Authentication entry |
| `/app` | authenticated | Live docket overview |
| `/app/inbox` | authenticated | Notices and intake instructions |
| `/app/notices/:noticeId` | authenticated | Original notice and processing state |
| `/app/obligations/:obligationId` | authenticated | Obligation, evidence, timeline, and next action |
| `/app/drafts/:draftId` | authenticated | Review and approve a follow-up draft |
| `/settings/inbox` | authenticated | Intake address and inbox settings |
| `/privacy` | public | Privacy notice |
| `/terms` | public | Terms |

Filters and selected records must be represented in the URL so a meaningful workspace state can be shared and restored.

## Convex queries

### `users.current`

Auth: authenticated.

Returns the current product profile. Never returns provider secrets.

### `inboxes.byCurrentUser`

Auth: authenticated.

Returns active inbox aliases owned by the current user.

### `notices.listByCurrentUser`

Auth: authenticated.

Arguments: `processingState`, `cursor`, and `limit`.

Returns a paginated list ordered by `updatedAt` descending.

### `notices.getOwned`

Auth: authenticated.

Arguments: `noticeId`.

Returns the notice only if it belongs to the current user.

### `obligations.listByCurrentUser`

Auth: authenticated.

Arguments: `status`, `dueWindow`, `cursor`, and `limit`.

Returns live docket rows ordered by due date and then update time.

### `obligations.getOwnedDetail`

Auth: authenticated.

Arguments: `obligationId`.

Returns the obligation, evidence records, activity events, and available draft status.

### `activity.listForOwnedObligation`

Auth: authenticated.

Arguments: `obligationId` and `limit`.

Returns timeline events after ownership is checked.

## Convex mutations

### `notices.createFromPaste`

Auth: authenticated.

Arguments: subject and body text.

Creates a notice with `sourceType: paste`, writes a received event, and schedules processing.

### `notices.updateProcessingState`

Auth: internal server call only.

Updates a notice after a verified internal processing transition.

### `obligations.updateReview`

Auth: authenticated.

Arguments: obligation id and editable fields.

Updates only owned obligations. A review update appends an activity event.

### `obligations.setStatus`

Auth: authenticated.

Arguments: obligation id and allowed next status.

Rejects invalid state transitions and appends an activity event.

### `emailDrafts.create`

Auth: authenticated.

Creates a draft tied to an owned obligation. The draft is not sent.

### `emailDrafts.update`

Auth: authenticated.

Updates recipients, subject, and body for an owned draft while its status is `draft`.

### `emailDrafts.approve`

Auth: authenticated.

Changes a draft from `draft` to `approved` and records the approving user and time in the activity event metadata.

### `emailDrafts.markSending`

Auth: internal server call only.

Claims an approved draft for one send attempt and prevents duplicate sends.

### `emailDrafts.recordDelivery`

Auth: internal server call only.

Writes `sent` or `failed` from a verified AgentMail response.

## Convex actions

### `processing.extractNotice`

Auth: internal scheduled call.

Calls OpenAI with the notice content, validates the structured result, and calls an internal mutation to create obligations and activity events.

Rules:

- Never trust unvalidated model output.
- Preserve ambiguity.
- Do not create a verified URL from model output alone.
- Do not include unnecessary personal data in the provider request.

### `processing.verifyObligation`

Auth: internal scheduled call.

Calls Firecrawl with a candidate official source and writes evidence through an internal mutation.

Rules:

- Store retrieval time, page title, URL, and supporting excerpt.
- A crawl failure creates `unableToVerify`.
- Do not delete the original notice on failure.

### `email.sendApprovedDraft`

Auth: internal scheduled call after approval.

Calls AgentMail only after `markSending` succeeds. Writes delivery state through an internal mutation.

Rules:

- No direct browser call.
- No send without approval.
- Duplicate delivery webhooks are idempotent.

## HTTP webhook routes

### `POST /webhooks/agentmail/inbound`

Auth: AgentMail signature verification.

Purpose: receive an inbound message, resolve the Docket inbox alias, deduplicate by provider message ID, and schedule processing.

Response:

```json
{ "accepted": true }
```

The response must not include notice body content.

### `POST /webhooks/agentmail/delivery`

Auth: AgentMail signature verification.

Purpose: record sent, delivered, bounced, or failed delivery state by provider message ID.

Response:

```json
{ "accepted": true }
```

### `GET /health`

Auth: public.

Returns a minimal service health response without environment details.

## Rate limits and retry policy

- Paste intake: 20 requests per user per hour in the first release.
- Notice processing: one active processing run per notice.
- OpenAI action: exponential retry for transient provider failures, maximum three attempts.
- Firecrawl action: exponential retry for transient provider failures, maximum three attempts.
- AgentMail send: one claimed send attempt per approved draft, manual retry after a failed state.
- Webhooks: respond quickly, enqueue work, and deduplicate by provider event ID.

## Error contract

User-facing errors use a stable shape:

```json
{
  "code": "PROVIDER_TIMEOUT",
  "message": "The source check timed out. The original notice is safe and can be retried.",
  "retryable": true
}
```

Internal logs may contain a correlation ID, but must not contain secrets, full notice bodies, private attachment content, or access tokens.
