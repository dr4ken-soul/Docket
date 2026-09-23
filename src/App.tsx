import { useEffect, useState } from "react";
import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import { useConvexAuth } from "@convex-dev/auth/react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Landing } from "@/pages/Landing";
import { SignIn } from "@/pages/SignIn";
import { Docket } from "@/pages/app/Docket";
import { Inbox } from "@/pages/app/Inbox";
import { NoticeDetail } from "@/pages/app/NoticeDetail";
import { ObligationDetail } from "@/pages/app/ObligationDetail";
import { DraftReview } from "@/pages/app/DraftReview";
import { SettingsInbox } from "@/pages/app/SettingsInbox";
import { Privacy } from "@/pages/Privacy";
import { Terms } from "@/pages/Terms";
import { NotFound } from "@/pages/NotFound";

/**
 * Gate that redirects unauthenticated users to the sign-in page.
 */
function RequireAuth() {
  const { isAuthenticated, isLoading } = useConvexAuth();
  const ensureCurrent = useMutation(api.users.ensureCurrent);
  const [profileReady, setProfileReady] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      setProfileReady(false);
      return;
    }

    let active = true;
    void ensureCurrent({}).then(() => {
      if (active) setProfileReady(true);
    });

    return () => {
      active = false;
    };
  }, [ensureCurrent, isAuthenticated]);

  if (isLoading) return null;
  if (!isAuthenticated) return <Navigate to="/sign-in" replace />;
  if (!profileReady) {
    return (
      <div className="flex min-h-[100dvh] items-center justify-center bg-[var(--bg-primary)] text-sm text-[var(--text-secondary)]">
        Loading your Docket…
      </div>
    );
  }
  return <Outlet />;
}

/**
 * Application router. Public routes render the landing, sign-in, privacy and
 * terms pages. Authenticated workspace routes are guarded by RequireAuth.
 */
export function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/sign-in" element={<SignIn />} />
      <Route path="/privacy" element={<Privacy />} />
      <Route path="/terms" element={<Terms />} />
      <Route element={<RequireAuth />}>
        <Route path="/app" element={<Docket />} />
        <Route path="/app/inbox" element={<Inbox />} />
        <Route path="/app/notices/:noticeId" element={<NoticeDetail />} />
        <Route path="/app/obligations/:obligationId" element={<ObligationDetail />} />
        <Route path="/app/drafts/:draftId" element={<DraftReview />} />
        <Route path="/settings/inbox" element={<SettingsInbox />} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
