import { ReactNode } from "react";
import { SkipLink, MorphNav, ScrollProgress } from "@/components/layout/MorphNav";
import { useScrollState } from "@/hooks/useScrollState";

export interface ShellProps {
  /** Page content. */
  children: ReactNode;
}

/**
 * Top level layout. Renders the skip link, the scroll-morph navigation pill,
 * the B1 scroll progress line, and the main content region. Applies the
 * coded atmospheric background layers from the frontend specification.
 */
export function Shell({ children }: ShellProps) {
  const { compact, progress } = useScrollState();
  return (
    <>
      <SkipLink />
      <MorphNav compact={compact} />
      <ScrollProgress progress={progress} />
      <main
        id="main-content"
        className="relative isolate min-h-[100dvh] overflow-x-clip bg-[var(--bg-primary)]"
      >
        <AtmosphericLayers />
        {children}
      </main>
    </>
  );
}

/**
 * Static but atmospheric background layers: a dot grid and a noise grain.
 * They stay below readable content and below interactive motion.
 */
function AtmosphericLayers() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-[0] overflow-hidden bg-[var(--bg-primary)]"
    >
      <div className="absolute inset-0 opacity-[0.22] [background-image:radial-gradient(circle_at_1px_1px,oklch(0.95_0.02_100_/_0.12)_1px,transparent_0)] [background-size:24px_24px]" />
      <div className="absolute inset-0 opacity-[0.06] noise" />
    </div>
  );
}
