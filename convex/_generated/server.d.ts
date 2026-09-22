/* eslint-disable */
/**
 * Generated utilities for implementing server-side Convex query and mutation functions.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */
import {
  actionGeneric,
  httpActionGeneric,
  queryGeneric,
  mutationGeneric,
  internalActionGeneric,
  internalMutationGeneric,
  internalQueryGeneric,
} from "convex/server";
import type {
  ActionBuilder,
  HttpActionBuilder,
  MutationBuilder,
  QueryBuilder,
  GenericActionCtx,
  GenericDatabaseReader,
  GenericDatabaseWriter,
  GenericMutationCtx,
  GenericQueryCtx,
  GenericDataModel,
} from "convex/server";
import type { DataModel } from "./dataModel.js";

export type { DataModel };

/**
 * Define a query in this Convex app's public API.
 *
 * @param func - The query function. It receives a {@link QueryCtx} as its first argument.
 * @returns The wrapped query.
 */
export const query: QueryBuilder<DataModel, "public"> = queryGeneric;

/**
 * Define a query that is only accessible from other Convex functions.
 *
 * @param func - The query function. It receives a {@link QueryCtx} as its first argument.
 * @returns The wrapped query.
 */
export const internalQuery: QueryBuilder<DataModel, "internal"> = internalQueryGeneric;

/**
 * Define a mutation in this Convex app's public API.
 *
 * @param func - The mutation function. It receives a {@link MutationCtx} as its first argument.
 * @returns The wrapped mutation.
 */
export const mutation: MutationBuilder<DataModel, "public"> = mutationGeneric;

/**
 * Define a mutation that is only accessible from other Convex functions.
 *
 * @param func - The mutation function. It receives a {@link MutationCtx} as its first argument.
 * @returns The wrapped mutation.
 */
export const internalMutation: MutationBuilder<DataModel, "internal"> = internalMutationGeneric;

/**
 * Define an action in this Convex app's public API.
 *
 * @param func - The action. It receives an {@link ActionCtx} as its first argument.
 * @returns The wrapped action.
 */
export const action: ActionBuilder<DataModel, "public"> = actionGeneric;

/**
 * Define an action that is only accessible from other Convex functions.
 *
 * @param func - The function. It receives an {@link ActionCtx} as its first argument.
 * @returns The wrapped function.
 */
export const internalAction: ActionBuilder<DataModel, "internal"> = internalActionGeneric;

/**
 * Define an HTTP action.
 *
 * @param func - The function. It receives an {@link ActionCtx} as its first argument
 * and a Fetch API `Request` object as its second.
 * @returns The wrapped function. Import this from `convex/http.js` and route it to hook it up.
 */
export const httpAction: HttpActionBuilder = httpActionGeneric;

export declare const env: Record<string, string | undefined>;

/**
 * A set of services for use within Convex query functions.
 */
export type QueryCtx<
  DataModelArg extends GenericDataModel = DataModel,
> = GenericQueryCtx<DataModelArg>;

/**
 * A set of services for use within Convex mutation functions.
 */
export type MutationCtx<
  DataModelArg extends GenericDataModel = DataModel,
> = GenericMutationCtx<DataModelArg>;

/**
 * A set of services for use within Convex action functions.
 */
export type ActionCtx<
  DataModelArg extends GenericDataModel = DataModel,
> = GenericActionCtx<DataModelArg>;

/**
 * A set of services for use within Convex internal mutation functions.
 */
export type InternalMutationCtx<
  DataModelArg extends GenericDataModel = DataModel,
> = GenericMutationCtx<DataModelArg>;

/**
 * A set of services for use within Convex HTTP action functions.
 */
export type HttpActionCtx<
  DataModelArg extends GenericDataModel = DataModel,
> = GenericActionCtx<DataModelArg>;

/**
 * An interface to read from the database within Convex query functions.
 */
export type DatabaseReader<
  DataModelArg extends GenericDataModel = DataModel,
> = GenericDatabaseReader<DataModelArg>;

/**
 * An interface to read from and write to the database within Convex mutation functions.
 */
export type DatabaseWriter<
  DataModelArg extends GenericDataModel = DataModel,
> = GenericDatabaseWriter<DataModelArg>;
