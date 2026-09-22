# Convex All Gas Hackathon Setup Handoff

This document records setup actions that must be completed before implementation and must not be confused with the required final `hackathon.md` build log.

## Event

Convex All Gas Hackathon

## Required setup

- Read the complete official Convex agent setup instructions.
- Install the Convex integration supported by the active coding agent.
- Install the project-local Convex hackathon skill under `.agents/skills/convex-hackathon-skill/` when appropriate.
- Verify the skill files are present and readable.
- Start the official hackathon build log with the event field exactly as `Convex All Gas Hackathon`.

## Hosting decision

### Required user confirmation before Convex setup

The coding agent must stop and ask the user to choose exactly one frontend host before installing the hosting component, creating `hackathon.md`, or beginning deployment configuration.

The agent must ask:

```text
Which frontend host should Docket use for the hackathon, convex.site or chatgpt.site?
```

The agent must not infer, silently select, or record a host before the user confirms it.

If the user chooses `convex.site`, record:

```text
Frontend: Convex static hosting
```

If the user chooses `chatgpt.site`, record:

```text
Frontend: Codex Sites
```

Recommended option: Convex static hosting with a public `convex.site` URL.

Alternative: ChatGPT Sites with a public `chatgpt.site` URL, if the project is later handed off to ChatGPT desktop or web for publication.

The user must confirm the final hosting option before `hackathon.md` is finalised. Do not claim a public deployment or active integration until it has been verified.

## Required final build-log fields

The root `hackathon.md` must include:

- Event: `Convex All Gas Hackathon`
- Frontend: either `Convex static hosting` or `Codex Sites`
- What was built
- Technology stack
- Live URL
- Demo link
- Evidence-based progress entries

Do not write secrets, deployment keys, authentication tokens, private database records, or personal notice content into the build log.

## Submission checklist

- Public source repository
- Root `hackathon.md`
- Public live URL judges can open without an invite
- Video within the current event limit
- Real use of Convex, OpenAI, Firecrawl, and AgentMail
- Social post tagging the required sponsors
- Submission through the official judging link
