import type { ReactNode } from "react";

interface EmptyStateProps {
  title: string;
  description: string;
  action?: ReactNode;
}

/** Renders an honest empty state with an optional next action. */
export function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <section className="empty-state">
      <p className="eyebrow">Nothing here yet</p>
      <h2>{title}</h2>
      <p>{description}</p>
      {action}
    </section>
  );
}
