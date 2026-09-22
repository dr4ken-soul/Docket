import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { WorkspaceLayout } from "@/components/workspace/WorkspaceLayout";
import { Skeleton } from "@/components/ui/Skeleton";
import { sampleNotice } from "@/lib/sample";

/**
 * Notices inbox. Lists received notices with their processing state, and
 * offers a paste fallback for the demo intake path.
 */
export function Inbox() {
  const notices = useQuery(api.notices.listByCurrentUser, {
    limit: 30,
  });
  const createPaste = useMutation(api.notices.createFromPaste);

  return (
    <WorkspaceLayout>
      <div className="flex flex-col gap-6">
        <div className="flex items-end justify-between gap-4 border-b border-[var(--border-default)] pb-6">
          <div>
            <h1 className="font-display text-[clamp(2rem,4vw,2.75rem)] font-semibold tracking-[-0.03em] text-[var(--text-primary)]">
              Notices
            </h1>
            <p className="mt-1 text-sm text-[var(--text-secondary)]">
              Your forwarded and pasted notices.
            </p>
          </div>
          <button
            type="button"
            onClick={async () => {
              await createPaste({
                subject: sampleNotice.subject,
                bodyText: sampleNotice.bodyText,
              });
            }}
            className="button-primary"
          >
            Paste sample notice
          </button>
        </div>

        {!notices ? (
          <Skeleton className="h-10 w-full" />
        ): notices.page.length === 0 ? (
          <EmptyInbox />
        ) : (
          <div className="grid gap-3">
            {notices.page.map((notice) => (
              <NoticeRow key={notice._id} notice={notice} />
            ))}
          </div>
        )}
      </div>
    </WorkspaceLayout>
  );
}

function EmptyInbox() {
  const createPaste = useMutation(api.notices.createFromPaste);
  return (
    <div className="empty-state">
      <h2>No notices yet</h2>
      <p>
        Forward a notice to your Docket intake address, or paste one to get
        started.
      </p>
      <button
        type="button"
        onClick={async () => {
          await createPaste({
            subject: sampleNotice.subject,
            bodyText: sampleNotice.bodyText,
          }).catch(() => undefined);
        }}
        className="mt-4 button-primary"
      >
        Add sample notice
      </button>
    </div>
  );
}

interface NoticeRowProps {
  notice: {
    _id: string;
    subject: string;
    sender?: string;
    sourceType: "agentmail" | "paste";
    processingState: "received" | "processing" | "complete" | "failed";
    receivedAt: number;
  };
}

function NoticeRow({ notice }: NoticeRowProps) {
  return (
    <a
      href={`/app/notices/${notice._id}`}
      className="block rounded-[14px] border border-[var(--border-subtle)] bg-[var(--bg-secondary)] p-4 text-sm transition-colors hover:bg-[var(--bg-elevated)]"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="font-semibold text-[var(--text-primary)]">
            {notice.subject}
          </p>
          {notice.sender && (
            <p className="text-xs text-[var(--text-secondary)]">
              From {notice.sender}
            </p>
          )}
        </div>
        <span
          className="status-badge status-neutral"
          style={{ width: "max-content" }}
        >
          {notice.processingState}
        </span>
      </div>
    </a>
  );
}
