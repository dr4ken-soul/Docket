/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as activity from "../activity.js";
import type * as auth from "../auth.js";
import type * as email from "../email.js";
import type * as evidence from "../evidence.js";
import type * as http from "../http.js";
import type * as inboxes from "../inboxes.js";
import type * as lib_agentmail from "../lib/agentmail.js";
import type * as lib_auth from "../lib/auth.js";
import type * as lib_errors from "../lib/errors.js";
import type * as lib_firecrawl from "../lib/firecrawl.js";
import type * as lib_llm from "../lib/llm.js";
import type * as lib_retry from "../lib/retry.js";
import type * as lib_text from "../lib/text.js";
import type * as lib_validators from "../lib/validators.js";
import type * as notices from "../notices.js";
import type * as obligations from "../obligations.js";
import type * as processing from "../processing.js";
import type * as users from "../users.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  activity: typeof activity;
  auth: typeof auth;
  email: typeof email;
  evidence: typeof evidence;
  http: typeof http;
  inboxes: typeof inboxes;
  "lib/agentmail": typeof lib_agentmail;
  "lib/auth": typeof lib_auth;
  "lib/errors": typeof lib_errors;
  "lib/firecrawl": typeof lib_firecrawl;
  "lib/llm": typeof lib_llm;
  "lib/retry": typeof lib_retry;
  "lib/text": typeof lib_text;
  "lib/validators": typeof lib_validators;
  notices: typeof notices;
  obligations: typeof obligations;
  processing: typeof processing;
  users: typeof users;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};
