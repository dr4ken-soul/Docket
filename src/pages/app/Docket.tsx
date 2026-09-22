import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { WorkspaceLayout } from "@/components/workspace/WorkspaceLayout";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Skeleton } from "@/components/ui/Skeleton";
import { formatDate, formatState } from "@/lib/format";
import { cn } from "@/lib/cn";

type Filter = "all" | "open" | "waiting" | "complete";

/**
 * Live docket overview. Shows the current user's obligations as a ledger,
 * filtered by status. Convex keeps the rows live across tabs.
 */
export function Docket() {
  const [filter, setFilter] = useState<Filter>("all");
  const [cursor, setCursor] = useState<string | null>(null);
  const status =
    filter === "all" ? undefined : filter === "complete" ? "complete" : filter;
  const result = useQuery(api.obligations.listByCurrentUser, {
    status,
    dueWindow: undefined,
    cursor: cursor ?? undefined,
    limit: 30,
  });
  const setStatus = useMutation(api.obligations.setStatus);

  if (!result) {
    return (
      <WorkspaceLayout>
        <DocketSkeleton />
      </WorkspaceLayout>
    );
  }

  const rows = result.page;
  const filters: { id: Filter; label: string }[] = [
    { id: "all", label: "All" },
    { id: "open", label: "Open" },
    { id: "waiting", label: "Waiting" },
    { id: "complete", label: "Complete" },
  ];

  return (
    <WorkspaceLayout>
      <div className="flex flex-col gap-6">
        <div className="flex items-end justify-between gap-4 border-b border-[var(--border-default)] pb-6">
          <div>
            <h1 className="font-display text-[clamp(2rem,4vw,2.75rem)] font-semibold tracking-[-0.03em] text-[var(--text-primary)]">
              Docket
            </h1>
            <p className="mt-1 text-sm text-[var(--text-secondary)]">
              {rows.length === 0
                ? "No open obligations."
                : `${rows.length} obligation${rows.length === 1 ? "" : "s"} shown.`}
            </p>
          </div>
          <div className="flex items-center gap-1.5" role="tablist">
            {filters.map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => {
                  setFilter(f.id);
                  setCursor(null);
                }}
                className={cn(
                  "px-3 py-1.5 text-xs font-semibold",
                  filter === f.id
                    ? "rounded-full bg-[var(--accent)]/10 text-[var(--accent)]"
                    : "text-[var(--text-muted)]",
                )}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {rows.length === 0 ? (
          <EmptyDocket />
        ) : (
          <div className="overflow-x-auto">
            <div className="min-w-[680px]">
              <div className="grid grid-cols-[1.5fr_0.8fr_0.8fr_0.9fr] border-b border-[var(--border-default)] px-3 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--text-muted)]">
                <span>Obligation</span>
                <span>Due</span>
                <span>Status</span>
                <span>Action</span>
              </div>
              {rows.map((row) => (
                <ObligationRow
                  key={row._id}
                  obligation={row}
                  onComplete={() => setStatus({ obligationId: row._id, status: "complete" })}
                />
              ))}
            </div>
          </div>
        )}

        {result.continueCursor && (
          <button
            type="button"
            onClick={() => setCursor(result.continueCursor)}
            className="self-start text-sm text-[var(--accent)] underline"
          >
            Load more
          </button>
        )}
      </div>
    </WorkspaceLayout>
  );
}

function EmptyDocket() {
  return (
    <div className="empty-state text-center">
      <h2>No obligations yet</h2>
      <p>
        Forward a notice or paste its text to create your first obligation.
      </p>
      <a
        href="/app/inbox"
        className="mt-4 inline-flex min-h-11 items-center rounded-full bg-[var(--accent)] px-5 py-3 text-sm font-semibold text-[var(--bg-primary)]"
      >
        Add a notice
      </a>
    </div>
  );
}

function DocketSkeleton() {
  return (
    <div className="flex flex-col gap-4">
      {Array.from({ length: 5 }).map((_, i) => (
        <Skeleton key={i} className="h-14 w-full" />
      ))}
    </div>
  );
}

function ObligationRow({
  obligation,
  onComplete,
}: {
  obligation: {
    _id: string;
    title: string;
    status: string;
    dueAt?: number;
  };
  onComplete: () => void;
}) {
  const dueLabel = formatDate(obligation.dueAt);
  return (
    <div className="ledger-row">
      <span className="font-semibold text-[var(--text-primary)]">
        {obligation.title}
      </span>
      <span>{dueLabel}</span>
      <span>
        <StatusBadge
          variant={
            obligation.status === "complete"
              ? "success"
              : obligation.status === "waiting"
                ? "warning"
                : "accent"
          }
        >
          {formatState(obligation.status)}
        </StatusBadge>
      </span>
      <button
        type="button"
        onClick={onComplete}
        className="text-xs text-[var(--accent)] underline"
      >
        Mark complete
      </button>
    </div>
  );
}
