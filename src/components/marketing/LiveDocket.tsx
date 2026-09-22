import { Section } from "./Section";

/**
 * Section 5, Live docket. An operational ledger of sample obligations. The
 * rows use staggered reveal animations.
 */
export function LiveDocket() {
  const header =
    "grid grid-cols-[1.5fr_0.8fr_0.8fr_0.9fr] border-b border-[var(--border-default)] px-3 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--text-muted)]";
  const row =
    "grid grid-cols-[1.5fr_0.8fr_0.8fr_0.9fr] items-center border-b border-[var(--border-subtle)] px-3 py-5 text-sm text-[var(--text-secondary)] transition-colors duration-150 hover:bg-[var(--bg-secondary)]";

  const rows = [
    {
      title: "Permit renewal documents",
      due: "18 Oct",
      status: "Review",
      statusClass: "text-[var(--accent)]",
      source: "Official page",
    },
    {
      title: "School form confirmation",
      due: "22 Oct",
      status: "Ready",
      statusClass: "text-[var(--success)]",
      source: "Forwarded email",
    },
    {
      title: "Insurance evidence request",
      due: "Awaiting date",
      status: "Review needed",
      statusClass: "text-[var(--text-muted)]",
      source: "Unverified",
    },
  ];

  return (
    <Section stagger>
      <div className="flex flex-col justify-between gap-6 border-b border-[var(--border-default)] pb-8 md:flex-row md:items-end">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--accent)]">
            Live docket
          </p>
          <h2 className="mt-4 text-balance font-display text-[clamp(2.75rem,5vw,5.5rem)] font-semibold leading-[0.9] tracking-[-0.04em] text-[var(--text-primary)]">
            Know what needs attention.
          </h2>
        </div>
        <p className="max-w-[34ch] text-sm leading-6 text-[var(--text-secondary)]">
          Convex keeps each change visible across the workspace.
        </p>
      </div>
      <div className="mt-8 overflow-x-auto">
        <div className="min-w-[680px]">
          <div className={header}>
            <span>Obligation</span>
            <span>Due</span>
            <span>Status</span>
            <span>Source</span>
          </div>
          {rows.map((item) => (
            <div key={item.title} className={row}>
              <span className="font-semibold text-[var(--text-primary)]">
                {item.title}
              </span>
              <span>{item.due}</span>
              <span className={item.statusClass}>{item.status}</span>
              <span>{item.source}</span>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}

export default LiveDocket;
