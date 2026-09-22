import { Section } from "./Section";

const bento =
  "rounded-[14px] border border-[var(--border-subtle)] bg-[var(--bg-secondary)] p-5 md:p-6";

/**
 * Section 3, Intake system. An asymmetric bento grid describing the intake
 * journey. Section id is `evidence` per the layout specification.
 */
export function IntakeSystem() {
  return (
    <Section id="evidence" stagger>
      <div className="mb-12 grid gap-6 md:grid-cols-[0.45fr_0.55fr] md:items-end md:gap-12">
        <h2 className="text-balance font-display text-[clamp(2.75rem,5vw,5.5rem)] font-semibold leading-[0.9] tracking-[-0.04em] text-[var(--text-primary)]">
          A notice becomes a docket.
        </h2>
        <p className="max-w-[54ch] text-pretty text-base leading-[1.65] text-[var(--text-secondary)] md:text-lg">
          Docket keeps the original message, the supporting source, and the next
          action together.
        </p>
      </div>
      <div className="grid auto-rows-[minmax(180px,auto)] grid-cols-1 gap-3 md:grid-cols-4 md:gap-4">
        <article className="rounded-[14px] border border-[var(--border-default)] bg-[var(--bg-surface)] p-5 md:col-span-2 md:row-span-2 md:p-7">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--accent)]">
            01, Intake
          </p>
          <h3 className="mt-14 max-w-[12ch] font-display text-4xl font-semibold leading-[0.92] tracking-[-0.03em] text-[var(--text-primary)] md:mt-20 md:text-6xl">
            Start with the message you already have.
          </h3>
          <p className="mt-6 max-w-[42ch] text-sm leading-6 text-[var(--text-secondary)]">
            Forward it to your Docket inbox or paste the text directly.
          </p>
        </article>
        <article className={bento}>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--text-muted)]">
            Required action
          </p>
          <p className="mt-6 text-xl font-semibold leading-tight text-[var(--text-primary)]">
            Confirm the renewal documents and reply.
          </p>
        </article>
        <article className={bento}>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--text-muted)]">
            Due
          </p>
          <p className="mt-6 font-display text-4xl font-semibold tracking-[-0.03em] text-[var(--accent)]">
            18 Oct
          </p>
        </article>
        <article className={bento}>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--text-muted)]">
            Evidence
          </p>
          <p className="mt-6 flex items-center gap-2 text-base font-semibold text-[var(--success)]">
            <span aria-hidden="true">✓</span>
            <span>Official source supported</span>
          </p>
        </article>
      </div>
    </Section>
  );
}

export default IntakeSystem;
