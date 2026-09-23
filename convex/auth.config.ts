/**
 * Registers Convex Auth's JWT issuer with Convex's request authentication
 * layer. This file must live inside the Convex functions directory.
 */
export default {
  providers: [
    {
      domain: process.env.CONVEX_SITE_URL,
      applicationID: "convex",
    },
  ],
};
