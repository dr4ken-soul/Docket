# Hackathon Log Format

Use British English and do not use em dashes.

## Entry template

```markdown
### DD Month YYYY

Completed:

- Concise factual change with a path or other evidence

Validated:

- `command` passed with a concise observed result
- Public or provider check completed with sensitive values removed

Pending:

- Next unverified task
```

Omit an empty subsection rather than inventing content.

## Evidence wording

Prefer precise statements:

- `convex/lib/llm.ts` configures the LLM client
- `npm run typecheck` passed on 21 September 2026
- The public URL returned the application without an invite
- Firecrawl returned a page title and supporting excerpt for a synthetic notice

Avoid unsupported statements:

- The integration is complete
- Everything works
- Production ready
- Deployed, when the URL was not checked
- Tested, when no test or manual check was observed

## URL format

Keep unverified links explicit:

```markdown
- Live URL: pending deployment
- Demo URL: pending recording
- Repository URL: pending publication
```

After verification, replace only the relevant line:

```markdown
- Live URL: https://<verified-app>.convex.site
```

## Provider evidence

Name the operation without including payload secrets or personal data:

```markdown
- Groq returned schema-conforming structured obligations for a synthetic renewal notice
- Firecrawl retrieved the configured official source and returned a supporting excerpt
- AgentMail accepted an approved synthetic follow-up and returned a redacted message identifier
```

Use this exact LLM description when the stack is summarised:

```text
OpenAI-compatible LLM endpoint, using Groq as the configured backend in this build
```

## Validation evidence

Record the exact command and whether it passed or failed:

```markdown
- `npm run lint` passed
- `npm run build` failed because `<concise non-sensitive reason>`
```

Do not hide failures. Add a later dated entry when the failure is fixed.

## Secret check

Before saving, confirm the entry contains no:

- API keys
- OAuth client secrets
- tokens
- webhook signatures
- private records
- personal notice content
- private email addresses
- full provider payloads
