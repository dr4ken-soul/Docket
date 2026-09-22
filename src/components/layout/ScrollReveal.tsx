import { ReactNode } from "react";
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
  const ref = useRepeatableReveal<HTMLDivElement>();
  if (!stagger) {
    return (
      <div ref={ref} className={className}>
        <div className="reveal">{children}</div>
      </div>
    );
  }
  const childrenArray = Array.isArray(children) ? children : [children];
  return (
    <div ref={ref} className={className}>
      {childrenArray.map((child, i) => (
        <div
          key={i}
          className="reveal"
          style={{ "--reveal-delay": `${i * 0.08}s` } as React.CSSProperties}
        >
          {child}
        </div>
      ))}
    </div>
  );
}
