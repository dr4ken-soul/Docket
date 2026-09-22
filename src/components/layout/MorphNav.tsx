/**
 * Skip link that appears on keyboard focus, pointing to the main content.
 */
export function SkipLink() {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[500] focus:rounded-[10px] focus:bg-[var(--accent)] focus:px-4 focus:py-3 focus:text-sm focus:font-semibold focus:text-[var(--bg-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--text-primary)]"
    >
      Skip to main content
    </a>
  );
}

export interface ScrollProgressProps {
  /** Current scroll progress as a 0 to 1 value. */
  progress: number;
}

/**
 * A one-pixel progress line that fills from the left as the page scrolls.
 */
export function ScrollProgress({ progress }: ScrollProgressProps) {
  return (
    <div
      aria-hidden="true"
      className="absolute bottom-0 left-0 h-px w-full bg-[var(--border-subtle)]"
    >
      <div
        className="h-px origin-left bg-[var(--accent)] transition-transform duration-150 ease-linear"
        style={{ transform: `scaleX(${progress})` }}
      />
    </div>
  );
}

export interface MorphNavProps {
  compact: boolean;
}

import { cn } from "@/lib/cn";

/**
 * Scroll-morph navigation pill. Expands to a floating pill before 80px
 * scroll and collapses to a compact rounded pill afterwards.
 */
export function MorphNav({ compact }: MorphNavProps) {
  const base =
    "fixed inset-x-0 top-0 z-[200] px-4 py-4 md:px-8 md:py-5 transition-[background-color,transform,border-radius] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]";
  const expanded =
    "mx-auto flex w-full max-w-[1280px] items-center justify-between border-b border-[var(--border-subtle)] bg-[color:oklch(0.16_0.018_160_/_0.72)] px-4 py-3 backdrop-blur-md md:px-6";
  const collapsed =
    "mx-auto max-w-[420px] rounded-full border border-[var(--border-default)] bg-[color:oklch(0.20_0.022_160_/_0.86)] px-2 py-2 shadow-[0_16px_48px_oklch(0.10_0.03_160_/_0.20)]";
  return (
    <nav className={cn(base, compact ? collapsed : expanded)} aria-label="Primary navigation">
      <a
        href="#top"
        className="min-h-11 flex items-center font-display text-2xl font-semibold tracking-[-0.02em] text-[var(--text-primary)] outline-none transition-colors duration-150 hover:text-[var(--accent)] focus-visible:ring-2 focus-visible:ring-[var(--accent)] md:text-3xl"
      >
        Docket
      </a>
      {!compact && (
        <>
          <div className="hidden items-center gap-1 md:flex">
            <a
              href="#evidence"
              className="nav-link"
            >
              Evidence
            </a>
            <a
              href="#workflow"
              className="nav-link"
            >
              Workflow
            </a>
            <a
              href="#security"
              className="nav-link"
            >
              Trust
            </a>
            <button
              type="button"
              className="group ml-2 flex min-h-11 items-center gap-3 rounded-full bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-[var(--bg-primary)] transition-colors duration-150 hover:bg-[var(--accent-hover)] focus-visible:ring-2 focus-visible:ring-[var(--text-primary)]"
            >
              <span>Forward a notice</span>
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[var(--bg-primary)]/10 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-px">
                <span aria-hidden="true" className="text-base leading-none">
                  ↗
                </span>
              </span>
            </button>
          </div>
          <button
            type="button"
            aria-label="Open navigation"
            className="flex min-h-11 min-w-11 items-center justify-center rounded-[10px] border border-[var(--border-default)] text-[var(--text-primary)] transition-colors duration-150 hover:bg-[var(--bg-secondary)] focus-visible:ring-2 focus-visible:ring-[var(--accent)] md:hidden"
          >
            <span aria-hidden="true" className="text-lg">
              +
            </span>
          </button>
        </>
      )}
    </nav>
  );
}
