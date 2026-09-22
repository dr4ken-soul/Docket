import type { CSSProperties, ReactNode } from "react";
import { useRepeatableReveal } from "@/hooks/useRepeatableReveal";

export interface ScrollRevealProps {
  /** When true, each direct child is wrapped with a staggered delay. */
  stagger?: boolean;
  children: ReactNode;
  className?: string;
}

/**
 * Wraps children in a reveal container that re-animates whenever it re-enters
 * the viewport. Toggles the `.reveal` / `.is-revealed` classes via
 * IntersectionObserver, matching the repeatable reveal contract in
 * `FRONTEND_SPEC.md`. When `stagger` is set, each direct child receives an
 * indexed delay so lists stagger on entry.
 */
export function ScrollReveal({
  stagger = false,
  children,
  className,
}: ScrollRevealProps) {
  if (!stagger) {
    return (
      <div className={className}>
        <ScrollRevealItem>{children}</ScrollRevealItem>
      </div>
    );
  }
  const childrenArray = Array.isArray(children) ? children : [children];
  return (
    <div className={className}>
      {childrenArray.map((child, i) => (
        <ScrollRevealItem key={i} delay={i * 0.08}>
          {child}
        </ScrollRevealItem>
      ))}
    </div>
  );
}

function ScrollRevealItem({
  children,
  delay = 0,
}: {
  children: ReactNode;
  delay?: number;
}) {
  const ref = useRepeatableReveal<HTMLDivElement>();
  return (
    <div
      ref={ref}
      className="reveal"
      style={{ "--reveal-delay": `${delay}s` } as CSSProperties}
    >
      {children}
    </div>
  );
}
