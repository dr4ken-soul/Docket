import { Shell } from "@/components/layout/Shell";

/**
 * Docket privacy notice.
 */
export function Privacy() {
  return (
    <Shell>
      <section className="content-section relative z-[100] px-4 py-24 md:px-8 md:py-32 lg:px-16">
        <div className="mx-auto max-w-[720px]">
          <h1 className="font-display text-[clamp(2.75rem,5vw,5.5rem)] font-semibold leading-[0.9] tracking-[-0.04em] text-[var(--text-primary)]">
            Privacy
          </h1>
          <p className="mt-6 max-w-[54ch] text-base leading-7 text-[var(--text-secondary)]">
            Docket processes notices locally within your Convex deployment. We
            keep only the minimum needed to run extraction, source verification,
            and approved follow-up. No notice text, evidence, or provider
            tokens are sent to any server you have not approved.
          </p>
        </div>
      </section>
    </Shell>
  );
}

export default Privacy;
