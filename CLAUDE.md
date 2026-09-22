# Docket Agent Context

## Product

Docket turns official emails and notices into verified, trackable obligations. A user forwards a notice or pastes its text. OpenAI extracts actions and dates. Firecrawl checks relevant official sources. Convex stores the typed records and provides live updates. AgentMail handles intake and approved follow-up email.

## Hackathon

Event: Convex All Gas Hackathon

Required sponsor work:

- Convex is the backend for database records, functions, and live synchronisation.
- OpenAI performs structured notice interpretation.
- Firecrawl performs source retrieval and verification.
- AgentMail receives the intake notice and sends an approved follow-up.

The final build must use a public `convex.site` or `chatgpt.site` frontend, a public source repository, a root `hackathon.md` build log, and a video within the event limit. Hosting choice remains a setup decision until explicitly confirmed.

## Current status

- Project name: Docket
- Documentation: product specifications, README, hackathon build log, and project-local progress skill are present
- Application code: implementation skeleton is present in `src/` and `convex/`
- Provider code: server-side LLM, Firecrawl, and AgentMail helpers are present, but live credentials and successful provider calls are not verified
- Convex setup: project configuration and server libraries are present, with environment and live validation pending
- Hosting: Convex static hosting selected, public URL pending deployment and verification
- Deployment: not verified
- Demo and submission: pending

## Approved visual direction

- Primary aesthetic: Bento grid operational
- Supporting aesthetic: Kinetic editorial
- Fingerprint: split-screen / Swiss rational / cold ops / technical grid / editorial stagger / subtle precision
- Navigation: A2 Scroll-morph pill with B1 scroll-progress behaviour
- Atmosphere: Static but atmospheric
- Section transition: Staggered viewport reveal
- Display: Barlow Condensed
- Body: IBM Plex Sans
- Palette: Cold Evidence, defined in `FRONTEND_SPEC.md`
- Hero: Split-screen evidence console

## Product rules

- Evidence must be visible next to confidence.
- Never turn an unverified source into a verified claim.
- Never send an email without explicit user approval.
- Never call provider APIs from the browser when a server-side action is appropriate.
- Never expose provider keys to client code.
- Keep each provider result traceable to a Docket record.
- Preserve the original notice even when enrichment fails.
- Do not provide legal, medical, tax, or financial advice.

## Code rules

- TypeScript identifiers use camelCase.
- Add JSDoc to functions and custom hooks.
- Use semantic HTML and visible focus states.
- Use CSS classes for hover states, not inline mouse event style mutation.
- Use CSS variables for palette tokens rather than hardcoded colours in components.
- Use `min-h-[100dvh]` for full viewport surfaces.
- Keep `backdrop-filter` limited to fixed or sticky elements.
- Use named z-index tokens from the frontend spec.
- Use repeatable viewport reveals, not one-shot reveals.
- Include reduced-motion handling.
- Use British English in UI copy and documentation.
- Never use em dashes.

## Data handling

- User-owned Convex queries must filter by authenticated identity.
- Webhook handlers must verify signatures and deduplicate provider event IDs.
- Do not log full notice bodies, private attachments, email content, access tokens, or personal data.
- Store source excerpts and metadata only where needed for the evidence trail.
- Do not invent user research statistics or performance claims.

## Build order

1. Confirm Convex integration and install the hackathon skill.
2. Choose and record frontend hosting.
3. Create the Convex schema and authentication boundary.
4. Build notice intake and idempotency.
5. Add OpenAI extraction with strict validation.
6. Add Firecrawl verification and evidence records.
7. Build the live docket query and mutations.
8. Add AgentMail draft, approval, send, and delivery state.
9. Implement the approved frontend specification.
10. Test provider failures, empty states, permissions, and public deployment.
11. Update `hackathon.md` after meaningful progress.

## Files to read first

- `APP_BLUEPRINT.md` for product and architecture.
- `FRONTEND_SPEC.md` for all visual decisions and exact classes.
- `BUILD_GUIDE.md` for the implementation sequence.
- `docs/SCHEMA.md` for the data model.
- `docs/ROUTES.md` for function and route boundaries.

## Do not do

- Do not build a generic chat interface.
- Do not build a developer-only dashboard.
- Do not use mock provider labels in the final demo when the provider can be called for real.
- Do not add autonomous external actions without user approval.
- Do not publish, deploy, submit, commit, or push without a direct user request for that action.
