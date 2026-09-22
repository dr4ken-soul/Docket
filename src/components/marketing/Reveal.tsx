import type { CSSProperties, ReactNode } from "react";
import { useRepeatableReveal } from "../../hooks/useRepeatableReveal";

interface RevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

/** Wraps content in a repeatable viewport reveal. */
export function Reveal({ children, className = "", delay = 0 }: RevealProps) {
  const ref = useRepeatableReveal<HTMLDivElement>();
  return <div ref={ref} className={`reveal ${className}`} style={{ "--reveal-delay": `${delay}s` } as CSSProperties}>{children}</div>;
}
