import { useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { Doc, Id } from "@/convex/_generated/dataModel";
import { WorkspaceLayout } from "@/components/workspace/WorkspaceLayout";
import { Skeleton } from "@/components/ui/Skeleton";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { formatDateTime, formatState } from "@/lib/format";
import { normaliseError } from "@/lib/errors";

type DraftDoc = Doc<"emailDrafts">;

/** Maps a draft status to the matching badge variant. */
function statusVariant(status: string) {
  if (status === "sent") return "success" as const;
  if (status === "approved") return "accent" as const;
  if (status === "sending") return "warning" as const;
  if (status === "failed") return "error" as const;
  return "neutral" as const;
}

/**
 * Draft review. Shows a pending follow-up draft for an obligation, lets the
 * user edit recipients, subject and body, and requires explicit approval
 * before any send is attempted.
 */
export function DraftReview() {
  const { draftId } = useParams<{ draftId: string }>();
  const draft = useQuery(
    api.email.getOwned,
    draftId ? { draftId: draftId as Id<"emailDrafts"> } : "skip",
  );

  if (draft === undefined) {
    return (
      <WorkspaceLayout>
        <Skeleton className="h-10 w-48" />
        <Skeleton className="mt-4 h-6 w-full" />
        <Skeleton className="mt-6 h-40 w-full" />
      </WorkspaceLayout>
    );
  }

  if (draft === null) {
    return (
      <WorkspaceLayout>
        <div className="empty-state">
          <h2>Draft not found</h2>
          <p>This draft is not available in your workspace.</p>
          <a
            href="/app"
            className="mt-4 inline-flex min-h-11 items-center rounded-full bg-[var(--accent)] px-5 py-3 text-sm font-semibold text-[var(--bg-primary)]"
          >
            Back to docket
          </a>
        </div>
      </WorkspaceLayout>
    );
  }

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
            Follow-up draft
          </h1>
          <StatusBadge variant={statusVariant(draft.status)}>
            {formatState(draft.status)}
          </StatusBadge>
        </div>
        {draft.status === "draft" ? (
          <DraftForm draft={draft} />
        ) : (
          <DraftSummary draft={draft} />
        )}
      </div>
    </WorkspaceLayout>
  );
}

/**
 * Links the draft back to its owning obligation by title.
 */
function ObligationLink({ obligationId }: { obligationId: Id<"obligations"> }) {
  const detail = useQuery(api.obligations.getOwnedDetail, { obligationId });
  if (!detail) {
    return <span className="text-sm text-[var(--text-muted)]">Loading obligation</span>;
  }
  return (
    <a
      href={`/app/obligations/${detail.obligation._id}`}
      className="text-sm text-[var(--accent)] underline"
    >
      {detail.obligation.title}
    </a>
  );
}

/**
 * Editable form for a draft that has not been approved yet. Changes are saved
 * with the update mutation; sending requires an explicit approval.
 */
function DraftForm({ draft }: { draft: DraftDoc }) {
  const update = useMutation(api.email.update);
  const approve = useMutation(api.email.approve);
  const [recipients, setRecipients] = useState(draft.to.join(", "));
  const [subject, setSubject] = useState(draft.subject);
  const [bodyText, setBodyText] = useState(draft.bodyText);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const splitRecipients = (value: string) =>
    value
      .split(",")
      .map((part) => part.trim())
      .filter(Boolean);

  const save = async () => {
    setBusy(true);
    setError(null);
    try {
      await update({
        draftId: draft._id,
        to: splitRecipients(recipients),
        subject,
        bodyText,
      });
    } catch (caught) {
      setError(normaliseError(caught).message);
    } finally {
      setBusy(false);
    }
  };

  const approveAndSend = async () => {
    setBusy(true);
    setError(null);
    try {
      await approve({ draftId: draft._id });
    } catch (caught) {
      setError(normaliseError(caught).message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="grid gap-5">
      <div className="rounded-[14px] border border-[var(--border-subtle)] bg-[var(--bg-secondary)] p-4">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--text-muted)]">
          Related obligation
        </p>
        <div className="mt-2">
          <ObligationLink obligationId={draft.obligationId} />
        </div>
      </div>
      <label className="grid gap-1.5 text-sm">
        <span className="font-semibold text-[var(--text-secondary)]">Recipients</span>
        <input
          type="text"
          value={recipients}
          onChange={(event) => setRecipients(event.target.value)}
          placeholder="name@example.com, other@example.com"
          className="input-field"
        />
      </label>
      <label className="grid gap-1.5 text-sm">
        <span className="font-semibold text-[var(--text-secondary)]">Subject</span>
        <input
          type="text"
          value={subject}
          onChange={(event) => setSubject(event.target.value)}
          className="input-field"
        />
      </label>
      <label className="grid gap-1.5 text-sm">
        <span className="font-semibold text-[var(--text-secondary)]">Body</span>
        <textarea
          value={bodyText}
          onChange={(event) => setBodyText(event.target.value)}
          rows={8}
          className="input-field resize-y"
        />
      </label>
      {error && (
        <p className="rounded-[10px] border border-[var(--error)]/20 bg-[var(--error)]/10 p-3 text-sm text-[var(--error)]">
          {error}
        </p>
      )}
      <div className="flex items-center gap-3">
        <button type="button" onClick={save} disabled={busy} className="button-secondary">
          Save changes
        </button>
        <button
          type="button"
          onClick={approveAndSend}
          disabled={busy}
          className="button-primary"
        >
          Approve and send
        </button>
      </div>
      <p className="text-xs text-[var(--text-muted)]">
        Nothing is sent until you approve. The approval is recorded in the
        activity timeline with your name and time.
      </p>
    </div>
  );
}

/**
 * Read-only summary for drafts that have moved past the editable state.
 */
function DraftSummary({ draft }: { draft: DraftDoc }) {
  return (
    <div className="grid gap-4">
      <div className="rounded-[14px] border border-[var(--border-subtle)] bg-[var(--bg-secondary)] p-4">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--text-muted)]">
          Related obligation
        </p>
        <div className="mt-2">
          <ObligationLink obligationId={draft.obligationId} />
        </div>
        <div className="mt-4 grid gap-2 text-sm">
          <p className="text-[var(--text-secondary)]">
            To {draft.to.join(", ")}
          </p>
          <p className="font-semibold text-[var(--text-primary)]">
            {draft.subject}
          </p>
        </div>
        <pre className="mt-3 whitespace-pre-wrap text-sm leading-6 text-[var(--text-secondary)]">
          {draft.bodyText}
        </pre>
      </div>
      {draft.status === "sent" && (
        <p className="rounded-[10px] border border-[var(--success)]/20 bg-[var(--success)]/10 p-3 text-sm text-[var(--success)]">
          Sent {draft.sentAt ? formatDateTime(draft.sentAt) : "recently"}.
        </p>
      )}
      {draft.status === "approved" && (
        <p className="text-sm text-[var(--text-secondary)]">
          Approved. Docket will send it as soon as the scheduler runs.
        </p>
      )}
      {draft.status === "sending" && (
        <p className="text-sm text-[var(--text-secondary)]">
          Sending through AgentMail.
        </p>
      )}
      {draft.status === "failed" && (
        <p className="rounded-[10px] border border-[var(--error)]/20 bg-[var(--error)]/10 p-3 text-sm text-[var(--error)]">
          The send failed. {draft.failureReason ?? ""}
        </p>
      )}
    </div>
  );
}
