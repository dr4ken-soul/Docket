import { useParams } from "react-router-dom";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { WorkspaceLayout } from "@/components/workspace/WorkspaceLayout";
import { Skeleton } from "@/components/ui/Skeleton";
import { StatusBadge } from "@/components/ui/StatusBadge";

/**
 * Notice detail. Shows the original subject, sender, processing state and any
 * processing error, plus a link back to the live docket.
 */
export function NoticeDetail() {
  const { noticeId } = useParams<{ noticeId: string }>();
  const notice = useQuery(
    api.notices.getOwned,
    noticeId ? { noticeId: noticeId as unknown as import("convex/values").GenericId<"notices"> } : "skip",
  );

  if (!notice) {
    return (
      <WorkspaceLayout>
        <Skeleton className="h-10 w-48" />
        <Skeleton className="mt-4 h-6 w-full" />
      </WorkspaceLayout>
    );
  }

  const stateVariant =
    notice.processingState === "complete"
      ? "success"
      : notice.processingState === "failed"
        ? "error"
        : "warning";

  return (
    <WorkspaceLayout>
      <div className="flex flex-col gap-6">
        <a
          href="/app"
          className="text-sm text-[var(--text-secondary)] underline"
        >
          {"<-"} Back to docket
        </a>
        <div className="flex items-center justify-between gap-4">
          <h1 className="font-display text-[clamp(2rem,4vw,2.75rem)] font-semibold tracking-[-0.03em] text-[var(--text-primary)]">
            {notice.subject}
          </h1>
          <StatusBadge variant={stateVariant}>
            {notice.processingState}
          </StatusBadge>
        </div>
        {notice.sender && (
          <p className="text-sm text-[var(--text-secondary)]">
            From {notice.sender}
          </p>
        )}
        {notice.processingError && (
          <p className="rounded-[10px] border border-[var(--error)]/20 bg-[var(--error)]/10 p-3 text-sm text-[var(--error)]">
            {notice.processingError}
          </p>
        )}
        <div className="rounded-[14px] border border-[var(--border-subtle)] bg-[var(--bg-secondary)] p-4">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--text-muted)]">
            Original notice
          </p>
          <pre className="whitespace-pre-wrap text-sm leading-6 text-[var(--text-secondary)]">
            {notice.bodyText}
          </pre>
        </div>
      </div>
    </WorkspaceLayout>
  );
}
