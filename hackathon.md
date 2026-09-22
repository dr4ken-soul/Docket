# Docket Hackathon Build Log

## Event

Convex All Gas Hackathon

## Submission status

- Frontend: Convex static hosting
- Live URL: pending deployment
- Demo URL: pending recording
- Public repository: pending publication
- Submission: pending

Pending links must remain labelled pending until they have been opened and verified. This file must not contain secrets, access tokens, private records, personal notice content, or unredacted provider payloads.

## Built product

Docket turns an official notice into a verified, trackable next action. A user can forward a notice through AgentMail or paste text, then review structured obligations, deadlines, confidence, source excerpts, official-source evidence, and follow-up email state in a live Convex workspace.

The application is designed around human approval. Docket may prepare a follow-up, but it must not send one until the user approves it.

## Technology

- Convex for data, server functions, authentication boundaries, live subscriptions, provider actions, and planned static frontend hosting
- React 18, TypeScript, Vite, and Tailwind CSS for the frontend
- OpenAI-compatible LLM endpoint, using Groq as the configured backend in this build
- Firecrawl for official-source retrieval and evidence
- AgentMail for inbound notices and approved outbound follow-up
- GitHub OAuth through Convex Auth

## Progress log

### 21 September 2026

Evidence reviewed in the repository:

- Product, architecture, frontend, schema, routes, and build documentation are present
- `package.json` defines development, build, lint, typecheck, and preview scripts
- React, Convex, Convex Auth, the OpenAI client, Vite, TypeScript, and Tailwind dependencies are declared
- `src/` contains the frontend directory structure for components, hooks, libraries, pages, and styles
- `convex/lib/` contains authentication, AgentMail, Firecrawl, LLM, retry, text, error, and validation helpers
- The LLM client uses an OpenAI-compatible interface and defaults to the Groq OpenAI-compatible base URL
- Firecrawl and AgentMail API keys are read from server-side environment variables
- GitHub OAuth client credentials are read from server-side environment variables
- Convex static hosting is selected for the frontend documentation and deployment plan
- The root README now documents local setup, provider configuration, OAuth callback, deployment, demo steps, security, and project structure
- The project-local hackathon skill and log-format reference have been added

Verified limitations on this date:

- No live `convex.site` URL was supplied or verified
- No demo video URL was supplied or verified
- No public repository URL was supplied or verified
- Provider credentials and successful live provider calls were not verified during this documentation pass
- Deployment and submission were not performed during this documentation pass

## Evidence rules

Every future progress entry must include a date and facts supported by one or more of the following:

- a repository file or diff
- a command and its observed result
- a successful provider response with sensitive values removed
- a public URL opened and checked
- a test, lint, typecheck, or build result
- a screenshot or recording reference that contains synthetic or redacted data

Do not record planned work as completed work. Do not claim a provider integration from dependency installation alone. Do not claim deployment until the public URL is reachable without an invite.

## Remaining work

- Complete and validate the end-to-end application workflow
- Configure Convex production environment variables without committing values
- Configure GitHub OAuth with `https://<app>.convex.site/_convex/auth`
- Verify AgentMail inbound delivery and approved outbound sending
- Verify structured extraction against the configured Groq backend
- Verify Firecrawl retrieval and evidence persistence
- Run lint, typecheck, and production build checks
- Deploy the frontend with Convex static hosting
- Verify the public live URL
- Record a demo using synthetic data
- Publish the repository and add the public URL
- Complete the official hackathon submission

## Final links

- Live URL: pending
- Demo URL: pending
- Repository URL: pending
