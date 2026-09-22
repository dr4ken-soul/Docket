# Docket Build Guide

This guide sequences implementation after the approved documentation and design gates. It does not authorise deployment, publication, submission, or source control operations.

## Before coding

Read these files in full:

1. `APP_BLUEPRINT.md`
2. `FRONTEND_SPEC.md`
3. `CLAUDE.md`
4. `docs/SCHEMA.md`
5. `docs/ROUTES.md`

Confirm the hosting choice before installing the final deployment component. The recommended path is Convex static hosting.

## Phase 0, environment setup

Run the Convex hackathon setup prompt in the command-capable coding agent. Follow the official Convex setup document and install the project-local hackathon skill in `.agents/skills/convex-hackathon-skill/` when the agent supports that location.

Verify, rather than assume, all of the following:

- The Convex integration is available or clearly marked restart-pending.
- The hackathon skill `SKILL.md` and `references/log-format.md` are readable.
- The project root is the Docket folder.
- No secrets were written to the build log.
- `hackathon.md` contains the exact event name after the hosting choice is recorded.

Ask the user only for authentication, command approval, restart, or the hosting choice if it cannot be inferred from the current environment.

## Phase 1, application skeleton

Create the React and TypeScript frontend and the Convex backend in the Docket folder. Keep the public page and workspace routes separate.

Suggested shape:

```text
Docket/
├── convex/
│   ├── schema.ts
│   ├── notices.ts
│   ├── obligations.ts
│   ├── verification.ts
│   ├── email.ts
│   ├── http.ts
│   └── lib/
├── src/
│   ├── app/
│   ├── components/
│   │   ├── layout/
│   │   ├── marketing/
│   │   ├── workspace/
│   │   └── ui/
│   ├── hooks/
│   ├── lib/
│   └── styles/
├── public/
├── docs/
├── APP_BLUEPRINT.md
├── FRONTEND_SPEC.md
├── BUILD_GUIDE.md
├── CLAUDE.md
├── PRODUCT.md
├── README.md
└── .env.example
```

## Phase 2, schema and identity

Implement the schema from `docs/SCHEMA.md` with validators for every field. Add authentication before user-owned queries. Test that a user cannot read another user’s notice, obligation, evidence, activity, or draft.

Acceptance checks:

- A signed-in user can create an inbox record.
- A user-owned query returns only that user’s records.
- Unauthenticated access returns a clear authentication state.
- Duplicate provider event IDs are rejected or treated as idempotent success.

## Phase 3, notice intake

Implement two input paths:

1. AgentMail inbound webhook.
2. User paste fallback for the demo and for providers that are not yet connected.

The inbound path must verify the provider event, normalise the payload, create a notice, and schedule processing. The paste path must create the same notice shape and visibly identify itself as pasted content.

Acceptance checks:

- The notice appears in Convex before enrichment starts.
- The UI shows received, processing, complete, and failed states.
- A repeated webhook does not create a duplicate notice.
- The original subject and body remain available to the owner.

## Phase 4, OpenAI extraction

Create a server-side action that sends the minimum necessary notice content to OpenAI and requests a strict structured response. Validate the response with the project schema before persistence.

Required extraction fields:

- obligation title
- action text
- due date
- date certainty
- owner suggestion
- source excerpt
- confidence
- ambiguity notes

Do not let the model create a verified source URL. URLs are discovered or accepted through the verification workflow and must be checked separately.

Acceptance checks:

- Invalid structured output becomes a recoverable processing error.
- Ambiguous dates are preserved as unresolved.
- Source excerpts refer to the original notice text.
- Provider errors do not delete the notice.

## Phase 5, Firecrawl verification

Create a server-side action that selects or accepts a candidate official URL, retrieves it through Firecrawl, and compares the relevant requirement against the returned content. Persist the URL, title, retrieval time, excerpt, and verification state.

Required states:

- supported
- partiallySupported
- unableToVerify
- pending

Acceptance checks:

- The UI can open the source URL.
- The evidence panel shows the excerpt and retrieval time.
- Crawl failure preserves the original extracted obligation.
- A source is never labelled supported without a supporting excerpt.

## Phase 6, live docket workspace

Implement queries for the active docket, filters, notice detail, obligation detail, timeline, evidence, and email draft state. Implement mutations for editing, confirming, completing, reopening, and assigning obligations.

Use live Convex queries. Do not poll from the browser when a subscription is available.

Acceptance checks:

- Opening the same workspace in two browser tabs reflects a status update in both.
- The URL preserves the selected filter and selected obligation.
- Empty states include a primary action.
- Loading states use skeletons, not indefinite spinners.

## Phase 7, AgentMail follow-up

Implement draft creation as a mutation or action boundary. Sending must require an explicit user approval mutation. The outbound action sends through AgentMail and then writes delivery state back to Convex.

Acceptance checks:

- The draft is visibly tied to one obligation.
- Recipient, subject, and body are editable before approval.
- The send button is disabled during the request and has a recoverable failure state.
- Delivery status is visible in the activity timeline.

## Phase 8, frontend implementation

Implement `FRONTEND_SPEC.md` in order:

1. Tokens and global foundation.
2. Skip link and navigation.
3. Hero evidence console.
4. Editorial problem statement.
5. Intake bento.
6. Evidence timeline.
7. Live docket ledger.
8. Before and after comparison.
9. System foundation rail.
10. Final action and footer.
11. Workspace routes and empty, loading, error, and success states.

Do not replace the approved visual direction with a generic dashboard template.

## Phase 9, verification and quality

Run:

```text
npm run lint
npm run typecheck
npm run build
```

If a command does not exist, add it to the project scripts before reporting verification complete.

Manual tests:

- keyboard navigation and focus visibility
- reduced-motion mode
- mobile width with no body overflow
- notice intake success
- notice intake failure
- OpenAI malformed response
- Firecrawl timeout
- AgentMail send failure
- duplicate webhook delivery
- two-user data isolation
- live update in two tabs
- deep link refresh for workspace and obligation detail
- runtime error boundary

## Phase 10, deployment preparation

Before deploying, verify:

- The selected host is recorded in `hackathon.md`.
- The public source repository is ready.
- Provider keys are configured in the deployment environment only.
- The live URL is reachable without an invite.
- The build log contains only evidence-backed claims.
- The public demo does not expose real personal data.

Ask before running deployment or publication commands.

## Phase 11, submission preparation

The final submission needs:

- public source repository
- root `hackathon.md`
- public `convex.site` or `chatgpt.site` URL
- video within the hackathon limit
- concise description of real Convex, OpenAI, Firecrawl, and AgentMail usage
- X or LinkedIn post tagging the required sponsors

Do not submit until the user explicitly asks for submission and the final checklist has passed.
