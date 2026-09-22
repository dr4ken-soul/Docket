import { useState } from "react";
import { Link } from "react-router-dom";
import { useScrollState } from "../../hooks/useScrollState";

/** Renders the responsive scroll-morph marketing navigation. */
export function MarketingNav() {
  const { compact, progress } = useScrollState();
  const [open, setOpen] = useState(false);
  const wrapperClass = compact
    ? "max-w-[420px] rounded-full border border-[var(--border-default)] bg-[color:oklch(0.20_0.022_160_/_0.86)] px-2 py-2 shadow-[0_16px_48px_oklch(0.10_0.03_160_/_0.20)]"
    : "max-w-[1280px] border-b border-[var(--border-subtle)] bg-[color:oklch(0.16_0.018_160_/_0.72)] px-4 py-3 md:px-6";

  return (
    <nav className="fixed inset-x-0 top-0 z-[200] px-4 py-4 md:px-8 md:py-5" aria-label="Primary navigation">
      <div className={`relative mx-auto flex w-full items-center justify-between backdrop-blur-md transition-[border-radius,background-color,max-width] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${wrapperClass}`}>
        <a href="#top" className="flex min-h-11 items-center font-display text-2xl font-semibold tracking-[-0.02em] text-[var(--text-primary)] outline-none transition-colors duration-150 hover:text-[var(--accent)] focus-visible:ring-2 focus-visible:ring-[var(--accent)]">Docket</a>
        {!compact ? <div className="hidden items-center gap-1 md:flex"><NavLinks /><Link className="primary-pill ml-2" to="/sign-in">Forward a notice <span aria-hidden="true">↗</span></Link></div> : <Link className="primary-pill" to="/sign-in">Open Docket <span aria-hidden="true">↗</span></Link>}
        {!compact ? <button type="button" aria-label={open ? "Close navigation" : "Open navigation"} aria-expanded={open} onClick={() => setOpen((value) => !value)} className="flex min-h-11 min-w-11 items-center justify-center rounded-[10px] border border-[var(--border-default)] text-[var(--text-primary)] hover:bg-[var(--bg-surface)] focus-visible:ring-2 focus-visible:ring-[var(--accent)] md:hidden"><span aria-hidden="true">{open ? "×" : "+"}</span></button> : null}
        <div aria-hidden="true" className="absolute bottom-0 left-0 h-px w-full overflow-hidden rounded-full bg-[var(--border-subtle)]"><div className="h-px origin-left bg-[var(--accent)] transition-transform duration-150 ease-linear" style={{ transform: `scaleX(${progress})` }} /></div>
      </div>
      {open && !compact ? <div className="mx-auto mt-2 flex max-w-[1280px] flex-col rounded-[14px] border border-[var(--border-default)] bg-[var(--bg-secondary)] p-3 shadow-lg md:hidden"><NavLinks /><Link className="primary-pill mt-2" to="/sign-in">Forward a notice <span aria-hidden="true">↗</span></Link></div> : null}
      <span className="sr-only" aria-live="polite">{compact ? "Compact navigation" : "Primary navigation"}</span>
    </nav>
  );
}

/** Renders the shared landing page anchor links. */
function NavLinks() {
  return <><a className="nav-link" href="#evidence">Evidence</a><a className="nav-link" href="#workflow">Workflow</a><a className="nav-link" href="#security">Trust</a></>;
}
