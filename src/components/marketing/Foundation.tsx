import { Section } from "./Section";

/**
 * Section 7, System foundation. A horizontal evidence rail describing the
 * four system layers. Section id is `security` per the layout specification.
 */
export function Foundation() {
  const cells = [
    { label: "Inbox", value: "AgentMail receives" },
    { label: "Reasoning", value: "OpenAI interprets" },
    { label: "Evidence", value: "Firecrawl checks" },
    { label: "State", value: "Convex keeps live" },
  ];
  return (
    <Section id="security" stagger>
      <div className="grid gap-8 md:grid-cols-[0.42fr_0.58fr] md:items-end">
        <h2 className="text-balance font-display text-[clamp(2.75rem,5vw,5.5rem)] font-semibold leading-[0.9] tracking-[-0.04em] text-[var(--text-primary)]">
          Every decision keeps its trail.
        </h2>
        <p className="max-w-[48ch] text-base leading-[1.65] text-[var(--text-secondary)]">
          Docket connects inbox, source, reasoning, live state, and approved
          follow-up without hiding the handoffs.
        </p>
      </div>
      <div className="mt-12 grid gap-0 border-y border-[var(--border-default)] md:grid-cols-4">
        {cells.map((cell) => (
          <div
            key={cell.label}
            className="border-b border-[var(--border-subtle)] p-5 md:border-b-0 md:border-r md:p-6"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[var(--text-muted)]">
              {cell.label}
            </p>
            <p className="mt-4 text-base font-semibold text-[var(--text-primary)]">
              {cell.value}
            </p>
          </div>
        ))}
      </div>
    </Section>
  );
}

export default Foundation;
