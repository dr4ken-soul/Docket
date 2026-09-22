/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */
import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import { anyApi } from "convex/server";
import type * as activity from "../activity.js";
import type * as auth from "../auth.js";
import type * as email from "../email.js";
import type * as evidence from "../evidence.js";
import type * as inboxes from "../inboxes.js";
import type * as notices from "../notices.js";
import type * as obligations from "../obligations.js";
import type * as processing from "../processing.js";
import type * as schema from "../schema.js";
import type * as users from "../users.js";

const fullApi: ApiFromModules<{
  "activity": typeof activity,
  "auth": typeof auth,
  "email": typeof email,
  "evidence": typeof evidence,
  "inboxes": typeof inboxes,
  "notices": typeof notices,
  "obligations": typeof obligations,
  "processing": typeof processing,
  "schema": typeof schema,
  "users": typeof users,
}> = anyApi as any;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
> = anyApi as any;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
> = anyApi as any;
