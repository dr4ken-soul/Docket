/**
 * Convex client wiring for the Docket frontend.
 *
 * Builds a single {@link ConvexReactClient} against the deployment URL
 * declared in `VITE_CONVEX_URL`. Provider keys and secrets are never read
 * here. Provider keys live server-side in the Convex environment.
 */
import { ConvexReactClient } from "convex/react";

const convexUrl = import.meta.env.VITE_CONVEX_URL as string | undefined;

if (!convexUrl) {
  throw new Error("VITE_CONVEX_URL is required to start Docket");
}

/**
 * The shared Convex React client instance.
 */
export const convex = new ConvexReactClient(convexUrl);

/**
 * The deployment URL the client was constructed with.
 */
export const convexUrlValue = convexUrl;
