import { useAuthActions } from "@convex-dev/auth/react";
import { useLocation } from "react-router-dom";
import { useRouteRestoration } from "@/hooks/useRouteRestoration";

/**
 * Sign-in entry. Offers GitHub sign-in and records the intended post-login
 * route so it can be restored after the OAuth redirect.
 */
export function SignIn() {
  const { signIn } = useAuthActions();
  const location = useLocation();
  useRouteRestoration();

  const from =
    (location.state as { from?: string })?.from || "/app";

  const handleSignIn = async () => {
    await signIn("github", { redirectTo: from });
  };

  return (
    <main
      id="main-content"
      className="flex min-h-[100dvh] items-center justify-center bg-[var(--bg-primary)] px-4"
    >
      <div className="w-full max-w-[420px] text-center">
        <h1 className="font-display text-4xl font-semibold tracking-[-0.02em] text-[var(--text-primary)]">
          Docket
        </h1>
        <p className="mt-3 text-sm text-[var(--text-secondary)]">
          Sign in to turn notices into trackable actions.
        </p>
        <button
          type="button"
          onClick={handleSignIn}
          className="mt-8 w-full rounded-full bg-[var(--accent)] px-5 py-3 text-sm font-semibold text-[var(--bg-primary)] transition-colors duration-150 hover:bg-[var(--accent-hover)] focus-visible:ring-2 focus-visible:ring-[var(--text-primary)]"
        >
          Continue with GitHub
        </button>
        <p className="mt-6 text-xs text-[var(--text-muted)]">
          Your data stays on your Convex deployment. No third-party tracking.
        </p>
      </div>
    </main>
  );
}
