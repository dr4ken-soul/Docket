import { useParams } from "react-router-dom";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { WorkspaceLayout } from "@/components/workspace/WorkspaceLayout";
import { Skeleton } from "@/components/ui/Skeleton";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { formatDate, formatState } from "@/lib/format";

/**
 * Obligation detail. Shows the extracted action, source excerpt, evidence, the
 * activity timeline, and an available email draft with approval controls.
 */
export function ObligationDetail() {
  const { obligationId } = useParams<{ obligationId: string }>();
  const detail = useQuery(
    api.obligations.getOwnedDetail,
    obligationId
      ? {
          obligationId: obligationId as unknown as import("convex/values").GenericId<"obligations">,
        }
      : "skip",
  );
  const complete = useMutation(api.obligations.setStatus);

  if (!detail) {
    return (
      <WorkspaceLayout>
        <Skeleton className="h-10 w-48" />
        <Skeleton className="mt-4 h-6 w-full" />
      </WorkspaceLayout>
    );
  }

  const { obligation, evidence, activity, drafts } = detail;

  return (
    <WorkspaceLayout>
      <div className="grid gap-8 lg:grid-cols-[2fr_1fr]">
        <div>
          <h1 className="font-display text-[clamp(2rem,4vw,2.75rem)] font-semibold tracking-[-0.03em] text-[var(--text-primary)]">
            {obligation.title}
          </h1>
          <p className="mt-3 max-w-[54ch] text-base leading-6 text-[var(--text-secondary)]">
            {obligation.actionText}
          </p>

          <div className="mt-6 grid gap-2.5">
            <Field label="Due date" value={formatDate(obligation.dueAt)} />
            <Field label="Confidence" value={formatState(obligation.confidence)} />
            <Field label="Status" value={formatState(obligation.status)} />
          </div>

          <div className="mt-6">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--text-muted)]">
              Source excerpt
            </p>
            <blockquote className="mt-2 rounded-[10px] border-l-4 border-[var(--accent)] bg-[var(--bg-secondary)] p-4 text-sm italic text-[var(--text-secondary)]">
              {obligation.sourceExcerpt}
            </blockquote>
          </div>

          <div className="mt-8 flex gap-3">
            <button
              type="button"
              onClick={() => complete({ obligationId: obligation._id as unknown as never, status: "complete" })}
              className="button-primary"
            >
              Mark complete
            </button>
          </div>
        </div>

        <div className="grid gap-6">
          <EvidencePanel evidence={evidence} />
          <ActivityTimeline activity={activity} />
          {drafts.length > 0 && <DraftMini draft={drafts[drafts.length - 1]} />}
        </div>
      </div>
    </WorkspaceLayout>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[10px] border border-[var(--border-subtle)] bg-[var(--bg-secondary)] p-3">
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--text-muted)]">
        {label}
      </p>
      <p className="mt-1 text-sm text-[var(--text-primary)]">{value}</p>
    </div>
  );
}

function EvidencePanel({
  evidence,
}: {
  evidence: Array<{
    verificationState: string;
    url?: string;
    pageTitle?: string;
    supportingExcerpt?: string;
    failureReason?: string;
    retrievedAt?: number;
  }>;
}) {
  if (!evidence.length) {
    return (
      <div className="rounded-[14px] border border-[var(--border-subtle)] bg-[var(--bg-secondary)] p-4">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--text-muted)]">
          Evidence
        </p>
        <p className="mt-2 text-sm text-[var(--text-muted)]">
          No evidence yet. Verification runs automatically after extraction.
        </p>
      </div>
    );
  }
  return (
    <div className="grid gap-3">
      {evidence.map((item) => (
        <div
          key={item.verificationState}
          className="rounded-[10px] border border-[var(--border-subtle)] bg-[var(--bg-secondary)] p-3"
        >
          <StatusBadge
            variant={
              item.verificationState === "supported"
                ? "success"
                : item.verificationState === "partiallySupported"
                  ? "warning"
                  : "error"
            }
          >
            {formatState(item.verificationState)}
          </StatusBadge>
          {item.url && (
            <p className="mt-2 text-xs text-[var(--text-secondary)] break-all">
              {item.url}
            </p>
          )}
          {item.supportingExcerpt && (
            <p className="mt-2 text-sm text-[var(--text-secondary)]">
              {item.supportingExcerpt}
            </p>
          )}
          {item.failureReason && (
            <p className="mt-1 text-xs text-[var(--error)]">{item.failureReason}</p>
          )}
        </div>
      ))}
    </div>
  );
}

function ActivityTimeline({
  activity,
}: {
  activity: Array<{ kind: string; label: string; createdAt: number }>;
}) {
  if (!activity.length) return null;
  return (
    <div className="grid gap-3">
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--text-muted)]">
        Activity
      </p>
      {activity.map((event) => (
        <div key={event.kind + event.createdAt} className="text-sm">
          <span className="text-[var(--text-primary)]">{event.label}</span>
          <span className="mx-1 text-[var(--text-muted)]">·</span>
          <span className="text-[var(--text-muted)]">
            {formatDate(event.createdAt)}
          </span>
        </div>
      ))}
    </div>
  );
}

function DraftMini({
  draft,
}: {
  draft: { _id: string; status: string; subject: string; to: string[] };
}) {
  return (
    <a
      href={`/app/drafts/${draft._id as unknown as string}`}
      className="text-sm text-[var(--accent)] underline"
    >
      Draft ready: {draft.subject}
    </a>
  );
}
