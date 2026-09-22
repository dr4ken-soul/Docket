---
name: convex-hackathon-skill
description: Maintain evidence-backed progress documentation for Docket in the Convex All Gas Hackathon. Use when logging implementation, validation, deployment, demo, or submission progress in hackathon.md.
---

# Convex Hackathon Progress Logging

Use this project-local skill whenever work changes the factual progress of Docket for the Convex All Gas Hackathon.

## Purpose

Keep `hackathon.md` useful to judges and future contributors. Record what was actually built or verified, when it happened, and what evidence supports the claim.

## Required workflow

1. Read `hackathon.md` before adding an entry.
2. Read `references/log-format.md` for the required structure.
3. Inspect the relevant files or command results.
4. Add a dated entry only after evidence exists.
5. Separate completed work, validation, and remaining work.
6. Keep live, demo, and repository URLs labelled pending until verified.
7. Check the entry for secrets and personal data before saving.

## Evidence standards

Acceptable evidence includes:

- repository paths containing the implementation
- an observed command result
- a passing test, lint, typecheck, or build command
- a redacted provider response proving the requested operation
- a public URL that was opened successfully without an invite
- a demo or screenshot using synthetic or redacted data

A dependency, placeholder, interface, or planned file does not prove a working integration. State precisely whether work is implemented, configured, tested, deployed, or still pending.

## Required terminology

Use the event name exactly:

```text
Convex All Gas Hackathon
```

Describe the LLM integration exactly as:

```text
OpenAI-compatible LLM endpoint, using Groq as the configured backend in this build
```

Record the frontend host as:

```text
Convex static hosting
```

## Security rules

Never put any of the following in `hackathon.md`:

- API keys or OAuth secrets
- access, refresh, deployment, or webhook tokens
- private database records
- personal notice or email content
- unredacted provider payloads
- private email addresses or inbox aliases

Use environment variable names, redacted identifiers, and synthetic examples only.

## Status and URL rules

- Do not claim a provider is working until a real call has been verified.
- Do not claim a command passed unless its successful result was observed.
- Do not claim deployment until the public URL is reachable.
- Do not replace `pending` with a live, demo, or repository URL until it has been verified.
- Preserve failed checks as honest evidence when they are useful, including the command and a concise error summary.

## Related files

- `hackathon.md` is the canonical progress log.
- `README.md` contains setup, deployment, demo, and security guidance.
- `CLAUDE.md` contains current project status and working rules.
- `references/log-format.md` defines the log entry format.
