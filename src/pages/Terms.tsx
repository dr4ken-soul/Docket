import { Shell } from "@/components/layout/Shell";

/**
 * Docket terms of use.
 */
export function Terms() {
  return (
    <Shell>
      <section className="content-section relative z-[100] px-4 py-24 md:px-8 md:py-32 lg:px-16">
        <div className="mx-auto max-w-[720px]">
          <h1 className="font-display text-[clamp(2.75rem,5vw,5.5rem)] font-semibold leading-[0.9] tracking-[-0.04em] text-[var(--text-primary)]">
            Terms
          </h1>
          <p className="mt-6 max-w-[54ch] text-base leading-7 text-[var(--text-secondary)]">
            Docket is an evidence and organisation aid, not legal, financial, or
            professional advice. You remain responsible for any action you take
            on a notice. Follow-ups are only sent after you explicitly approve
            them.
          </p>
        </div>
      </section>
    </Shell>
  );
}

export default Terms;
