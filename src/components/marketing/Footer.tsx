/**
 * Section 9, Footer. The wordmark, navigation links, and sponsor attribution.
 */
export function Footer() {
  return (
    <footer className="relative z-[100] border-t border-[var(--border-subtle)] bg-[var(--bg-primary)] px-4 py-8 md:px-8 md:py-10 lg:px-16">
      <div className="mx-auto flex w-full max-w-[1280px] flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <span className="font-display text-2xl font-semibold tracking-[-0.02em] text-[var(--text-primary)]">
          Docket
        </span>
        <div className="flex flex-wrap gap-x-5 gap-y-3 text-sm text-[var(--text-muted)]">
          <a
            href="#evidence"
            className="transition-colors duration-150 hover:text-[var(--text-primary)] focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
          >
            Evidence
          </a>
          <a
            href="#workflow"
            className="transition-colors duration-150 hover:text-[var(--text-primary)] focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
          >
            Workflow
          </a>
          <a
            href="#security"
            className="transition-colors duration-150 hover:text-[var(--text-primary)] focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
          >
            Trust
          </a>
          <span>Built with Convex</span>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
