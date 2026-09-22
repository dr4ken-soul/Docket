import GitHub from "@auth/core/providers/github";
import { convexAuth } from "@convex-dev/auth/server";

/**
 * Convex Auth configuration for Docket.
 *
 * GitHub is the identity provider. Set GITHUB_CLIENT_ID and GITHUB_CLIENT_SECRET
 * in the Convex environment before deploying. Empty values are tolerated locally
 * so the frontend can still run before provider credentials are configured.
 *
 * This mirrors `convex/auth.ts` so the auth boundary is documented in one place.
 */
export const { auth, signIn, signOut, store } = convexAuth({
  providers: [
    GitHub({
      clientId: process.env.GITHUB_CLIENT_ID ?? "",
      clientSecret: process.env.GITHUB_CLIENT_SECRET ?? "",
    }),
  ],
});
