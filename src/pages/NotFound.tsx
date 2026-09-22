import { Shell } from "@/components/layout/Shell";

/**
 * Not-found page shown for unmatched routes.
 */
export function NotFound() {
  return (
    <Shell>
      <section className="content-section relative z-[100] flex min-h-[100dvh] items-center justify-center px-4 py-24 md:px-8 md:py-32 lg:px-16">
        <div className="text-center">
          <h1 className="font-display text-[clamp(3rem,8vw,6rem)] font-semibold leading-[0.86] tracking-[-0.045em] text-[var(--text-primary)]">
            404
          </h1>
          <p className="mt-4 max-w-[48ch] text-base text-[var(--text-secondary)]">
            That page is not available.
          </p>
          <a
            href="/"
            className="mt-6 inline-flex min-h-11 items-center rounded-full border border-[var(--border-default)] px-5 py-3 text-sm font-semibold text-[var(--text-primary)] transition-colors duration-150 hover:border-[var(--accent)] hover:text-[var(--accent)] focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
          >
            Return home
          </a>
        </div>
      </section>
    </Shell>
  );
}

export default NotFound;
