import { ReactNode } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useAuthActions } from "@convex-dev/auth/react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { cn } from "@/lib/cn";

const navLinks = [
  { to: "/app", label: "Docket" },
  { to: "/app/inbox", label: "Notices" },
  { to: "/settings/inbox", label: "Settings" },
];

/**
 * Workspace chrome. Provides a compact navigation rail and a sign-out control.
 */
export function WorkspaceLayout({ children }: { children: ReactNode }) {
  const { signOut } = useAuthActions();
  const location = useLocation();
  const navigate = useNavigate();
  const user = useQuery(api.users.current);

  return (
    <div className="flex min-h-[100dvh] bg-[var(--bg-primary)] text-[var(--text-primary)]">
      <aside className="sticky top-0 flex h-screen w-64 shrink-0 flex-col gap-6 overflow-y-auto border-r border-[var(--border-subtle)] bg-[var(--bg-secondary)] p-5">
        <div className="font-display text-2xl font-semibold tracking-[-0.02em] text-[var(--text-primary)]">
          Docket
        </div>
        <nav className="flex flex-col gap-1">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === "/app"}
              className={cn(
                "nav-link",
                location.pathname === link.to &&
                  link.to !== "/app" &&
                  location.pathname.startsWith(link.to)
                  ? "bg-[var(--bg-elevated)] text-[var(--text-primary)]"
                  : location.pathname === link.to
                    ? "bg-[var(--bg-elevated)] text-[var(--text-primary)]"
                    : "text-[var(--text-secondary)]",
              )}
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
        <div className="mt-auto flex items-center justify-between">
          <span className="text-xs text-[var(--text-muted)]">
            {user?.displayName ?? "Signed in"}
          </span>
          <button
            type="button"
            onClick={() => signOut().then(() => navigate("/sign-in"))}
            className="button-quiet"
          >
            Sign out
          </button>
        </div>
      </aside>
      <main className="flex-1 p-6 md:p-10">{children}</main>
    </div>
  );
}
