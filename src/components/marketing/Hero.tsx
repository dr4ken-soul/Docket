import { motion } from "motion/react";
import { useScrollState } from "@/hooks/useScrollState";

const BLUR = {
  initial: { filter: "blur(10px)", opacity: 0, y: 24 },
  animate: { filter: "blur(0px)", opacity: 1, y: 0 },
} as const;

/**
 * Full-viewport hero. Left column carries the value proposition and primary
 * call to action. Right column renders the live evidence console. The copy
 * uses staged entrance animations and the image layer respects pointer
 * parallax.
 */
export function Hero() {
  const { compact } = useScrollState();

  const leftVariants = {
    initial: { ...BLUR.initial },
    animate: { ...BLUR.animate },
  };

  return (
    <section
      id="top"
      className="relative z-[100] min-h-[100dvh] overflow-hidden px-4 pb-12 pt-32 md:px-8 md:pb-16 md:pt-40 lg:px-16"
    >
      <div className="mx-auto grid min-h-[calc(100dvh-10rem)] w-full max-w-[1280px] items-center gap-10 lg:grid-cols-[0.82fr_1.18fr] lg:gap-16">
        <div className="relative z-[100] max-w-[620px]">
          <motion.p
            className="mb-5 text-xs font-semibold uppercase tracking-[0.22em] text-[var(--accent)] md:mb-6 md:text-sm"
            initial={{ ...BLUR.initial, filter: "blur(10px)" }}
            animate={leftVariants.animate}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.25 }}
          >
            Inbox to action
          </motion.p>
          <motion.h1
            className="max-w-[620px] text-balance font-display text-[clamp(3.75rem,9vw,8.5rem)] font-semibold leading-[0.86] tracking-[-0.045em] text-[var(--text-primary)]"
            initial={BLUR.initial}
            animate={leftVariants.animate}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.4 }}
          >
            Make every notice actionable.
          </motion.h1>
          <motion.p
            className="mt-7 max-w-[54ch] text-pretty text-base leading-[1.65] text-[var(--text-secondary)] md:mt-8 md:text-lg"
            initial={BLUR.initial}
            animate={leftVariants.animate}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.7 }}
          >
            Docket turns official messages into verified actions, dates, and
            follow-ups you can track.
          </motion.p>
          <motion.div
            className="mt-8 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center md:mt-10"
            initial={BLUR.initial}
            animate={leftVariants.animate}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.9 }}
          >
            <a
              href="/sign-in"
              className="group flex min-h-12 items-center justify-between gap-4 rounded-full bg-[var(--accent)] px-5 py-2 text-sm font-semibold text-[var(--bg-primary)] transition-colors duration-150 hover:bg-[var(--accent-hover)] focus-visible:ring-2 focus-visible:ring-[var(--text-primary)] sm:min-w-[190px]"
            >
              <span>Forward a notice</span>
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--bg-primary)]/10 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-px">
                <span aria-hidden="true" className="text-base leading-none">
                  ↗
                </span>
              </span>
            </a>
            <a
              href="#workflow"
              className="flex min-h-12 items-center justify-center rounded-full border border-[var(--border-default)] px-5 py-3 text-sm font-semibold text-[var(--text-primary)] transition-colors duration-150 hover:border-[var(--accent)] hover:text-[var(--accent)] focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
            >
              See the workflow
            </a>
          </motion.div>
        </div>
        <EvidenceConsole compact={compact} />
      </div>
    </section>
  );
}

/**
 * Coded evidence console showing a sample notice becoming a verified
 * obligation. No raster asset required.
 */
function EvidenceConsole({ compact }: { compact: boolean }) {
  return (
    <motion.div
      className="relative z-[100] rounded-[20px] bg-[var(--bg-secondary)] p-2 ring-1 ring-[var(--border-default)] shadow-[0_20px_40px_-15px_oklch(0.82_0.18_101_/_0.05)] md:p-5"
      initial={{ ...BLUR.initial, scale: 0.985 }}
      animate={{ ...BLUR.animate, scale: 1 }}
      transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.55 }}
    >
      <div className="rounded-[14px] bg-[var(--bg-surface)] p-5 shadow-[inset_0_1px_1px_oklch(0.95_0.02_100_/_0.12)] md:p-7">
        <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-4">
          <div className="flex items-center gap-3">
            <span
              className="h-2.5 w-2.5 rounded-full bg-[var(--success)]"
              aria-hidden="true"
            />
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--text-secondary)]">
              Docket intake
            </span>
          </div>
          <span className="text-xs font-medium text-[var(--text-muted)]">
            Live
          </span>
        </div>
        <div className="py-6">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--text-muted)]">
            Incoming notice
          </p>
          <h2 className="mt-3 text-xl font-semibold leading-tight text-[var(--text-primary)] md:text-2xl">
            Permit renewal requires a response
          </h2>
          <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">
            Received from the forwarded inbox, 09:42
          </p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-[10px] border border-[var(--border-subtle)] bg-[var(--bg-secondary)] p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--text-muted)]">
              Due date
            </p>
            <p className="mt-2 text-lg font-semibold text-[var(--text-primary)]">
              18 October
            </p>
          </div>
          <div className="rounded-[10px] border border-[var(--border-subtle)] bg-[var(--bg-secondary)] p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--text-muted)]">
              Source check
            </p>
            <p className="mt-2 flex items-center gap-2 text-lg font-semibold text-[var(--success)]">
              <span aria-hidden="true">✓</span>
              <span>Supported</span>
            </p>
          </div>
        </div>
        <div className="mt-4 border-t border-[var(--border-subtle)] pt-4">
          <div className="flex items-center justify-between gap-4">
            <p className="text-sm font-medium text-[var(--text-secondary)]">
              Next action
            </p>
            <span className="rounded-full border border-[var(--accent)]/30 bg-[var(--accent)]/10 px-3 py-1 text-xs font-semibold text-[var(--accent)]">
              Ready to review
            </span>
          </div>
          <p className="mt-2 max-w-[54ch] text-balance text-base font-semibold text-[var(--text-primary)]">
            Confirm the renewal documents and send the reply.
          </p>
        </div>
      </div>
      {compact && (
        <div className="pointer-events-none absolute inset-0 z-[10] rounded-[20px] bg-[var(--bg-primary)]" />
      )}
    </motion.div>
  );
}
