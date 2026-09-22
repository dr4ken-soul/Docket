import { Section } from "./Section";

/**
 * The problem statement. A breathing editorial block between the hero and the
 * dense operational content.
 */
export function Problem() {
  return (
    <Section id="problem" band className="border-y border-[var(--border-subtle)] bg-[var(--bg-secondary)]">
      <div className="grid gap-10 md:grid-cols-[0.32fr_0.68fr] md:gap-16">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--accent)]">
          The problem
        </p>
        <h2 className="max-w-[18ch] text-balance font-display text-[clamp(2.75rem,6vw,6.5rem)] font-semibold leading-[0.9] tracking-[-0.04em] text-[var(--text-primary)]">
          The important part of a notice is usually buried inside it.
        </h2>
      </div>
    </Section>
  );
}
