import { Section } from "./Section";

/**
 * Section 8, Final action. A full-width action block with an accent edge and
 * a sample notice CTA.
 */
export function FinalAction() {
  return (
    <Section
      band
      className="border-t border-[var(--border-subtle)] bg-[var(--bg-secondary)]"
    >
      <div className="grid w-full gap-10 border-l-4 border-[var(--accent)] pl-6 md:grid-cols-[0.7fr_0.3fr] md:items-end md:gap-16 md:pl-10">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--accent)]">
            Start with the next notice
          </p>
          <h2 className="mt-4 max-w-[14ch] text-balance font-display text-[clamp(3rem,6vw,7rem)] font-semibold leading-[0.86] tracking-[-0.045em] text-[var(--text-primary)]">
            Forward the notice. Keep the answer.
          </h2>
        </div>
        <div className="flex flex-col items-stretch gap-3 md:items-end">
          <a
            href="/sign-in?sample=1"
            className="group flex min-h-12 w-full items-center justify-between gap-4 rounded-full bg-[var(--accent)] px-5 py-2 text-sm font-semibold text-[var(--bg-primary)] transition-colors duration-150 hover:bg-[var(--accent-hover)] focus-visible:ring-2 focus-visible:ring-[var(--text-primary)] md:w-auto md:min-w-[220px]"
          >
            <span>Try a sample notice</span>
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--bg-primary)]/10 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-px">
              <span aria-hidden="true" className="text-base leading-none">
                ↗
              </span>
            </span>
          </a>
          <a
            href="#workflow"
            className="flex min-h-12 items-center justify-center px-4 py-3 text-sm font-semibold text-[var(--text-secondary)] underline decoration-[var(--border-default)] underline-offset-4 transition-colors duration-150 hover:text-[var(--accent)] focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
          >
            View the workflow
          </a>
        </div>
      </div>
    </Section>
  );
}

export default FinalAction;
