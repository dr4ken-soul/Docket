# Docket App Blueprint

## Product summary

Docket turns confusing official emails and notices into verified, trackable obligations. A user forwards a notice to a Docket inbox. OpenAI identifies the required actions, dates, people, and missing information. Firecrawl checks the cited official source. Convex stores the structured obligation and pushes live status updates to the workspace. AgentMail sends a clear follow-up when the user needs to reply, confirm, or provide a document.

Docket is an everyday application, not a developer tool. Its primary promise is simple: the user should know what the notice requires, why Docket believes that, and what to do next.

## Working name

Project name: Docket

The name is a single word that describes a recorded obligation or case file. No logo symbol is required for the MVP. The interface uses a plain text wordmark until the user supplies a brand asset.

## Audience and jobs to be done

### Primary audience

1. Individuals receiving government, school, healthcare, insurance, tenancy, or utility notices.
2. Freelancers and small business owners handling compliance, renewals, invoices, and client paperwork.
3. Family or operations coordinators who track obligations for several people.

### Core job

When a notice arrives, the user wants to understand the required action and deadline without rereading the entire message or guessing which source is authoritative.

### Secondary jobs

- Keep a reliable list of open obligations.
- See which claims came from the original notice and which came from an official web source.
- Ask Docket to draft or send a follow-up email.
- See live progress while a notice is being interpreted and verified.

## Product principles

- Evidence before confidence. Every extracted obligation shows its source text or source URL.
- One next action at a time. The interface should reduce a notice to a useful sequence.
- Human approval before sending. Docket may draft an email, but the user approves sending it.
- Live state is visible. Processing, verification, waiting, and complete states are stored in Convex and reflected immediately.
- No invented certainty. If a source cannot be verified, Docket says so and asks for review.
- Plug and play. Email intake is the first connector, but the data model supports a pasted notice or uploaded text later.

## MVP feature set

### Feature 1: Notice intake

User story: As a user, I want to forward an official notice to a personal Docket address so that I do not need to copy and organise it manually.

Acceptance criteria:

- Each user has a unique intake address or inbox alias.
- A received message creates a notice record in Convex.
- The original sender, subject, received time, body, and attachments metadata are preserved.
- A visible processing state appears immediately.
- Failed intake shows a recoverable error and a retry action.

Complexity: High

### Feature 2: Obligation extraction

User story: As a user, I want Docket to extract actions, deadlines, required documents, and responsible people so that I can act without interpreting the notice alone.

Acceptance criteria:

- OpenAI returns typed obligations with a confidence label and source excerpt.
- Dates are stored with an explicit timezone or an unresolved date warning.
- Ambiguous requirements are marked for review rather than silently normalised.
- The user can edit an obligation before marking it ready.

Complexity: High

### Feature 3: Official-source verification

User story: As a user, I want Docket to check the notice against the relevant official source so that I can distinguish a real requirement from an outdated or suspicious message.

Acceptance criteria:

- Firecrawl fetches the candidate official URL or a configured source page.
- The result stores the URL, page title, retrieval time, and supporting excerpt.
- The UI distinguishes verified, partially supported, and unable to verify.
- A failed crawl does not erase the original notice.

Complexity: High

### Feature 4: Live docket workspace

User story: As a user, I want a live list of open obligations so that I can see what needs attention and what is waiting on someone else.

Acceptance criteria:

- Convex queries update the list without a manual refresh.
- Each obligation has status, due date, source, owner, and next action.
- Filters for open, due soon, waiting, and complete preserve the selected view in the URL.
- Empty and error states include a useful action.

Complexity: Medium

### Feature 5: Approved follow-up email

User story: As a user, I want Docket to draft and send a follow-up through AgentMail after I approve it so that an obligation can move forward without leaving the workspace.

Acceptance criteria:

- The draft shows recipients, subject, body, and the obligation it relates to.
- Sending requires an explicit approval action.
- AgentMail delivery status is written back to Convex.
- The obligation timeline records draft, approval, sent, and failed states.

Complexity: High

### Explicitly out of scope for MVP

- Autonomous sending without user approval.
- Legal, medical, tax, or financial advice.
- Identity verification or fraud certification.
- Native mobile apps.
- Broad inbox access to messages that the user has not forwarded or authorised.
- Automatic attachment submission to third-party portals.
- Multi-tenant enterprise administration.
- Billing and paid plans before the end-to-end workflow is proven.

The feature that creates willingness to pay is verified obligation handling, combining extraction, source evidence, and approved follow-up in one record. A basic summariser can be copied. An accountable workflow with evidence and live state is harder to replace.

## Convex and sponsor architecture

### Convex

Convex is the source of truth for users, notices, obligations, verification records, email drafts, delivery events, and activity events. Queries provide the live workspace. Mutations update state. Actions call external services and then persist the result through mutations.

### OpenAI

OpenAI converts notice text into a strict typed extraction. The model must return structured data only, with source spans, uncertainty, and a reason for each obligation. The server validates the response before writing it to Convex.

### Firecrawl

Firecrawl retrieves official pages and returns source content for verification. Docket stores only the relevant excerpt and metadata needed for the evidence trail. It does not present a crawl as proof unless the extracted requirement is supported by the returned source.

### AgentMail

AgentMail provides the intake mailbox and approved outbound follow-up. Incoming messages map to a user through a signed or controlled inbox address. Outbound messages include a Docket record reference in internal metadata, never in a way that exposes private workspace data to an unintended recipient.

## Technology decisions

| Layer | Decision | Reason |
|---|---|---|
| Frontend | React with TypeScript and Tailwind CSS | Exact responsive control for the approved frontend specification |
| Backend | Convex | Required hackathon backend, typed functions, live queries, mutations, and actions |
| AI extraction | OpenAI structured output through a server-side Convex action | Keeps provider keys off the browser and validates the result before persistence |
| Web verification | Firecrawl from a server-side Convex action | Sponsor service performs real retrieval work |
| Email | AgentMail inbound and outbound workflows | Sponsor service is central to the product rather than a README mention |
| Hosting | Convex static hosting, pending final hosting confirmation | Cross-agent path with a public `convex.site` URL |
| Authentication | Convex Auth or the current official Convex authentication path | Keeps identity close to the Convex data boundary |
| UI motion | CSS transitions plus motion/react only where component-level animation is useful | Product remains calm and operational |
| Database | Convex tables | Real-time subscriptions and typed validators |

## Data model

The canonical schema is documented in `docs/SCHEMA.md`. The core relationship is:

```text
user
  ├── inbox
  │     └── notice
  │           ├── obligation
  │           │     ├── evidence
  │           │     ├── emailDraft
  │           │     └── activityEvent
  │           └── processingRun
  └── activityEvent
```

Every user-owned query must filter by the authenticated user identity. External provider identifiers are stored only where needed for idempotency and delivery reconciliation.

## Server function boundaries

- Queries read workspace lists, notice detail, obligation detail, activity, and delivery state.
- Mutations create and edit user-owned records, update statuses, approve drafts, and append activity events.
- Actions call OpenAI, Firecrawl, and AgentMail. Actions do not trust client-supplied provider responses.
- Webhook handlers authenticate provider events, deduplicate them, and call internal mutations.

The route and function inventory is documented in `docs/ROUTES.md`.

## User journey

1. User opens Docket and sees the value proposition and sample notice workflow.
2. User creates an account or signs in.
3. Docket presents a personal intake address and a paste fallback.
4. User forwards a notice or pastes its content.
5. Convex creates the notice and shows the processing state live.
6. OpenAI extracts obligations and source spans.
7. Firecrawl checks the relevant official source.
8. Docket presents the obligation, evidence, due date, confidence, and next action.
9. User edits or confirms any ambiguous field.
10. Docket adds the item to the live docket.
11. If a reply is needed, AgentMail drafts a follow-up.
12. User approves sending.
13. Docket records delivery status and updates the obligation timeline.

## Empty, loading, and error states

- Empty inbox: explain how to forward the first notice and offer a paste sample action.
- Processing notice: show the original subject, current stage, and a skeleton evidence panel.
- Verification unavailable: preserve the extracted obligation, label the source as unverified, and offer retry.
- No open obligations: show a completed state with a clear intake action.
- Email send failure: preserve the draft and provide retry or copy actions.
- Provider timeout: show which provider timed out and what remains safe to retry.

## Market and competitive framing

The initial wedge is not generic email summarisation. Docket owns the space between receiving a notice and completing the required action.

Comparable categories include email assistants, task managers, document extraction tools, and compliance trackers. Their common gap is that they usually optimise one step. Docket connects intake, evidence, obligation state, and approved follow-up around a single notice.

### Initial customer segments

1. Freelancers and micro-businesses with recurring administrative obligations.
2. Families coordinating education, healthcare, housing, or public-service notices.
3. Small professional practices that need a lightweight obligation queue without buying a full compliance suite.

### Monetisation direction after MVP

- Free: limited monthly notices and manual review.
- Pro: higher intake volume, source verification, follow-up drafts, and history.
- Team: shared docket, owners, permissions, and retention controls.

Do not implement billing before the core workflow is reliable. Pricing should be validated through interviews and observed usage, not invented conversion claims.

## Security and privacy requirements

- Provider keys exist only in server-side environment variables.
- Never log full notice bodies, attachments, access tokens, or email content in production logs.
- Validate webhook signatures and reject duplicate event IDs after the first accepted event.
- Do not expose one user’s inbox alias, notices, obligations, or evidence to another user.
- Retain only the minimum provider data needed to operate the workflow.
- Clearly label that Docket is an organisation and verification aid, not professional advice.

## Hackathon proof plan

The judging demo must show real sponsor work:

1. Forward or paste a realistic notice.
2. Show Convex creating the notice and live processing state.
3. Show OpenAI extracting a typed obligation with a source excerpt.
4. Show Firecrawl verification with a real source URL and evidence excerpt.
5. Show the obligation appear in the live docket.
6. Approve a follow-up draft and show AgentMail delivery state.
7. Open the public hosted URL and show the same workflow without localhost.

The public repository must contain `hackathon.md` at the root once the hosting choice and Convex setup are confirmed. The build log must describe actual work and must never include secrets or personal information.

## Acceptance baseline before implementation is considered complete

- A notice can enter through AgentMail or the paste fallback.
- The full processing state is visible and recoverable.
- OpenAI, Firecrawl, and AgentMail each perform real work.
- Convex queries and mutations power the live workspace.
- User-owned data is isolated.
- The public host is reachable without an invite.
- The build log is current.
- The final submission includes the public repository, hosted URL, and video within the current hackathon rules.
