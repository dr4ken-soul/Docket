import { Section } from "./Section";

/**
 * Section 6, Before and after. An editorial comparison between the original
 * notice and the Docket record.
 */
export function BeforeAfter() {
  return (
    <Section band stagger className="border-y border-[var(--border-subtle)] bg-[var(--bg-secondary)]">
      <div className="max-w-[620px]">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--accent)]">
          The difference
        </p>
        <h2 className="mt-4 text-balance font-display text-[clamp(2.75rem,5vw,5.5rem)] font-semibold leading-[0.9] tracking-[-0.04em] text-[var(--text-primary)]">
          From message to next action.
        </h2>
      </div>
      <div className="mt-12 grid gap-4 lg:grid-cols-[1fr_auto_1fr] lg:items-stretch">
        <article className="rounded-[14px] border border-[var(--border-subtle)] bg-[var(--bg-primary)] p-6 md:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--text-muted)]">
            Original notice
          </p>
          <p className="mt-8 max-w-[34ch] text-base leading-7 text-[var(--text-secondary)]">
            Please provide the requested renewal documents before the stated
            date. See the official guidance for current requirements.
          </p>
        </article>
        <div
          className="flex items-center justify-center text-2xl text-[var(--accent)]"
          aria-hidden="true"
        >
          →
        </div>
        <article className="rounded-[14px] border border-[var(--accent)]/30 bg-[var(--bg-surface)] p-6 md:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--accent)]">
            Docket record
          </p>
          <p className="mt-8 text-xl font-semibold leading-tight text-[var(--text-primary)]">
            Collect the renewal documents and reply before 18 October.
          </p>
          <p className="mt-4 text-sm leading-6 text-[var(--text-secondary)]">
            Source checked. Follow-up draft available for approval.
          </p>
        </article>
      </div>
    </Section>
  );
}

export default BeforeAfter;
