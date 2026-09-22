import { ComponentProps } from "react";
import { cn } from "@/lib/cn";

export type ButtonProps = ComponentProps<"button"> & {
  variant?: "primary" | "secondary" | "quiet" | "danger" | "ghost";
  size?: "sm" | "md" | "lg";
};

/**
 * A button with design system variants and rounded caps.
 */
export function Button({
  variant = "primary",
  size = "md",
  className,
  children,
  ...rest
}: ButtonProps) {
  const base =
    "button inline-flex items-center justify-center gap-2 text-sm font-semibold transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:outline-none";
  const variants = {
    primary: "button-primary",
    secondary: "button-secondary",
    quiet: "button-quiet",
    danger: "button-danger",
    ghost: "button-quiet",
  } as const;
  const sizes = {
    sm: "min-h-10 px-3",
    md: "min-h-11 px-4",
    lg: "min-h-12 px-5",
  } as const;
  return (
    <button
      className={cn(base, variants[variant], sizes[size], className)}
      {...rest}
    >
      {children}
    </button>
  );
}
