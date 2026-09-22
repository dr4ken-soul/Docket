import { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { ScrollReveal } from "../layout/ScrollReveal";

export interface SectionProps {
  /** Section id for anchor navigation. */
  id?: string;
  /** Whether the section has the secondary background and top/bottom borders. */
  band?: boolean;
  /** Whether children stagger on reveal. */
  stagger?: boolean;
  className?: string;
  children: ReactNode;
}

/**
 * A content section with consistent horizontal padding, z-index stacking, and
 * optional viewport reveal. Matches the `content-section` / `section-band`
 * foundation classes from the frontend specification.
 */
export function Section({
  id,
  band = false,
  stagger = false,
  className,
  children,
}: SectionProps) {
  const classes = band ? "section-band" : "content-section";
  return (
    <section
      id={id}
      className={cn(classes, "relative z-[100] px-4 py-24 md:px-8 md:py-32 lg:px-16", className)}
    >
      <ScrollReveal stagger={stagger}>
        <div className="mx-auto w-full max-w-[1280px]">{children}</div>
      </ScrollReveal>
    </section>
  );
}
