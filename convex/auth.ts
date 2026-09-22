import GitHub from "@auth/core/providers/github";
import { convexAuth } from "@convex-dev/auth/server";

/**
 * Convex Auth handlers and storage for GitHub sign-in.
 */
export const { auth, signIn, signOut, store } = convexAuth({
  providers: [GitHub],
});
