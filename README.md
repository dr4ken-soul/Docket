# Docket

Docket turns official notices into verified, trackable next actions. Forward a notice or paste its text, review the extracted obligations, check the supporting official source, and keep the result in a live docket.

## Convex All Gas Hackathon

Docket is being built for the **Convex All Gas Hackathon**.

- Frontend hosting: Convex static hosting
- Public URL: pending deployment
- Demo URL: pending recording
- Source repository: pending publication

The public frontend is intended to be served from a `convex.site` URL. Until deployment is verified, no live URL is claimed.

## Features

- Notice intake through AgentMail or pasted text
- Structured obligation extraction with dates, owners, confidence, source excerpts, and uncertainty
- Official-source retrieval and evidence checking through Firecrawl
- Live Convex workspace for notices, obligations, evidence, activity, and draft state
- User-scoped records with authentication and ownership checks
- Follow-up email drafting through AgentMail
- Explicit approval before an outbound email is sent
- Retryable provider failures and safe user-facing error states

Docket is an organisation and evidence aid. It is not legal, medical, tax, or financial advice, and it does not send external messages without explicit approval.

## Technology

- React 18 with TypeScript
- Vite and Tailwind CSS
- Convex for the database, typed functions, authentication boundary, actions, mutations, queries, and live synchronisation
- An **OpenAI-compatible LLM endpoint, using Groq as the configured backend in this build** for structured notice interpretation
- Firecrawl for official-source retrieval
- AgentMail for inbound notice delivery and approved outbound follow-up
- GitHub OAuth through Convex Auth
- Convex static hosting for the frontend

Provider calls belong in server-side Convex code. Browser code must not receive provider keys.

## Local development

Requirements: Node.js 18 or newer, npm, and a Convex project.

Install dependencies:

```bash
npm install
```

Start the Convex development process in one terminal:

```bash
npx convex dev
```

Start the Vite frontend in another terminal:

```bash
npm run dev
```

Useful checks:

```bash
npm run lint
npm run typecheck
npm run build
```

## Environment variables

Set provider values in Convex, not in committed files. The application reads these server-side variables:

- `LLM_API_KEY`
- `LLM_BASE_URL`, defaulting to `https://api.groq.com/openai/v1`
- `LLM_MODEL`, defaulting to `llama-3.3-70b-versatile` when the base URL contains `groq`
- `FIRECRAWL_API_KEY`
- `AGENTMAIL_API_KEY`
- `AGENTMAIL_BASE_URL`, defaulting to `https://api.agentmail.to`
- `GITHUB_CLIENT_ID`
- `GITHUB_CLIENT_SECRET`

The configured LLM wording for this build is: **OpenAI-compatible LLM endpoint, using Groq as the configured backend in this build.** This describes the interface and configured backend without implying that the application calls the OpenAI-hosted service.

Set or inspect Convex environment variables with the Convex CLI:

```bash
npx convex env set LLM_API_KEY <value>
npx convex env set LLM_BASE_URL https://api.groq.com/openai/v1
npx convex env set LLM_MODEL llama-3.3-70b-versatile
npx convex env set FIRECRAWL_API_KEY <value>
npx convex env set AGENTMAIL_API_KEY <value>
npx convex env set GITHUB_CLIENT_ID <value>
npx convex env set GITHUB_CLIENT_SECRET <value>
npx convex env list
npx convex env unset VARIABLE_NAME
```

Replace placeholders locally. Never put real values in `README.md`, `hackathon.md`, source control, screenshots, or the demo recording.

## GitHub OAuth callback

For a deployed Convex Auth application, configure the GitHub OAuth callback as:

```text
https://<app>.convex.site/_convex/auth
```

Replace `<app>` with the deployed Convex application name. Use the exact deployed hostname in the GitHub OAuth application settings. Do not use a local callback as the production callback.

## Deployment

The planned deployment is Convex static hosting with a public `convex.site` frontend. Deployment should be performed only after the local build and provider error paths have been checked.

A typical release sequence is:

```bash
npm run lint
npm run typecheck
npm run build
npx convex deploy
```

Confirm the exact hosting command and project target with the installed Convex CLI before running it. After deployment:

1. Configure production Convex environment variables with `npx convex env set`.
2. Set the GitHub OAuth callback to `https://<app>.convex.site/_convex/auth`.
3. Open the public `convex.site` URL without an invite.
4. Test sign-in, notice intake, extraction, source verification, and approved follow-up with synthetic data.
5. Record the verified URL in `hackathon.md`.

No deployment has been claimed until these checks are complete.

## Demo script

Use synthetic notice data only.

1. Open the public Docket URL and sign in with GitHub.
2. Show the intake address or paste fallback.
3. Paste a fictional permit renewal notice with a deadline and an official source URL.
4. Show the notice entering Convex and the live processing state.
5. Show the structured obligation with action, due date, confidence, and source excerpt.
6. Show Firecrawl evidence with the source URL, page title, retrieval time, and supporting excerpt.
7. Show the item in the live docket and update its review state.
8. Create a follow-up draft tied to the obligation.
9. Approve the draft and show AgentMail delivery state.
10. Show that a failed provider operation preserves the notice and offers retry.

The demo should show real provider work where configured. Do not present fixtures as completed integration evidence.

## Structure

```text
Docket/
├── convex/                 Convex schema, functions, actions, and provider libraries
│   └── lib/                Auth, LLM, Firecrawl, AgentMail, retry, and validation helpers
├── src/                    React frontend
│   ├── components/         Layout, marketing, workspace, and UI components
│   ├── hooks/              Frontend hooks
│   ├── lib/                Client utilities and Convex integration
│   ├── pages/              Public and authenticated pages
│   └── styles/             Global styles
├── docs/                   Schema and route documentation
├── .agents/skills/         Project-local agent guidance
├── hackathon.md            Evidence-backed hackathon build log
├── CLAUDE.md               Project agent context
└── package.json            npm scripts and dependencies
```

## Security

- Keep all provider keys in Convex environment variables
- Enforce authenticated ownership checks on user-owned queries and mutations
- Verify and deduplicate AgentMail webhook events
- Require explicit user approval before sending a draft
- Do not log full notice bodies, attachments, email content, access tokens, or personal data
- Use synthetic data for screenshots, testing, and the public demo
- Retain only the provider data required for the workflow
- Treat missing or failed evidence as unverified, never as proof

See [`hackathon.md`](hackathon.md) for current progress and [`CLAUDE.md`](CLAUDE.md) for project-local working rules.
