import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { WorkspaceLayout } from "@/components/workspace/WorkspaceLayout";
import { Skeleton } from "@/components/ui/Skeleton";

/**
 * Inbox settings. Lists the user's intake inboxes and lets them create a new
 * AgentMail alias to receive forwarded notices.
 */
export function SettingsInbox() {
  const inboxes = useQuery(api.inboxes.byCurrentUser, {});
  const create = useMutation(api.inboxes.create);

  return (
    <WorkspaceLayout>
      <div className="flex flex-col gap-6">
        <div className="flex items-end justify-between gap-4 border-b border-[var(--border-default)] pb-6">
          <div>
            <h1 className="font-display text-[clamp(2rem,4vw,2.75rem)] font-semibold tracking-[-0.03em] text-[var(--text-primary)]">
              Inbox settings
            </h1>
            <p className="mt-1 text-sm text-[var(--text-secondary)]">
              Manage how notices enter Docket.
            </p>
          </div>
          <button
            type="submit"
            className="button-primary"
            onClick={() => {}}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                void create({ provider: "agentmail", alias: "inbox" });
              }
            }}
          >
            New inbox
          </button>
        </div>

        {!inboxes ? (
          <Skeleton className="h-10 w-full" />
        ) : inboxes.length === 0 ? (
          <EmptyInboxes />
        ) : (
          <div className="grid gap-3">
            {inboxes.map((inbox) => (
              <div
                key={inbox.alias}
                className="rounded-[14px] border border-[var(--border-subtle)] bg-[var(--bg-secondary)] p-4"
              >
                <p className="font-semibold text-[var(--text-primary)]">
                  {inbox.alias}@your-inbox.docket
                </p>
                <p className="text-xs text-[var(--text-muted)]">
                  {inbox.provider}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </WorkspaceLayout>
  );
}

function EmptyInboxes() {
  const create = useMutation(api.inboxes.create);
  return (
    <div className="empty-state">
      <h2>No inbox yet</h2>
      <p>Create an AgentMail alias to receive forwarded notices.</p>
      <button
        type="button"
        onClick={async () => {
          await create({
            provider: "agentmail",
            alias: "my-inbox",
          }).catch(() => undefined);
        }}
        className="mt-4 button-primary"
      >
        Create inbox
      </button>
    </div>
  );
}
