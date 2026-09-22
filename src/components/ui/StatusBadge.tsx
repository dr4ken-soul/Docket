import { ReactNode } from "react";

export type StatusVariant =
  | "success"
  | "warning"
  | "error"
  | "neutral"
  | "accent";

export interface StatusBadgeProps {
  variant?: StatusVariant;
  children: ReactNode;
  className?: string;
}

/**
 * A small status pill that maps semantic states to the Cold Evidence palette.
 */
export function StatusBadge({
  variant = "neutral",
  children,
  className,
}: StatusBadgeProps) {
  const variants = {
    success: "status-success",
    warning: "status-warning",
    error: "status-error",
    neutral: "status-neutral",
    accent:
      "border border-[var(--border-default)] bg-[var(--accent)]/10 rounded-full px-2.5 py-0.5 text-xs font-semibold text-[var(--accent)]",
  } as const;
  return (
    <span className={variants[variant].concat(className ? ` ${className}` : "")}>
      {children}
    </span>
  );
}
