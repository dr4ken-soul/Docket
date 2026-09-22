import { ConvexError } from "convex/values";

/**
 * Stable user safe Docket error codes.
 */
export const DocketErrorCodes = {
  AUTH_REQUIRED: "AUTH_REQUIRED",
  RECORD_NOT_AVAILABLE: "RECORD_NOT_AVAILABLE",
  RATE_LIMITED: "RATE_LIMITED",
  PROVIDER_NOT_CONFIGURED: "PROVIDER_NOT_CONFIGURED",
  PROVIDER_TIMEOUT: "PROVIDER_TIMEOUT",
  PROVIDER_ERROR: "PROVIDER_ERROR",
  EXTRACT_INVALID: "EXTRACT_INVALID",
  CRAWL_FAILED: "CRAWL_FAILED",
  SEND_FAILED: "SEND_FAILED",
  WEBHOOK_SIGNATURE_INVALID: "WEBHOOK_SIGNATURE_INVALID",
  WEBHOOK_ALIAS_UNKNOWN: "WEBHOOK_ALIAS_UNKNOWN",
  INVALID_TRANSITION: "INVALID_TRANSITION",
  INVALID_INPUT: "INVALID_INPUT",
} as const;

export type DocketErrorCode = (typeof DocketErrorCodes)[keyof typeof DocketErrorCodes];

export interface DocketError {
  code: DocketErrorCode;
  message: string;
  retryable: boolean;
}

/**
 * Prefix used to encode the Docket error contract inside a ConvexError message.
 */
export const ERROR_PREFIX = "DOCKET_ERROR:";

const GENERIC_MESSAGE = "Something went wrong. Please try again.";

/**
 * Throws a ConvexError carrying the Docket error contract shape
 * { code, message, retryable } encoded in the message payload.
 *
 * @param code stable internal error code
 * @param message safe user facing message
 * @param retryable whether retrying can succeed
 */
export function docketError(
  code: DocketErrorCode,
  message: string,
  retryable: boolean,
): never {
  throw new ConvexError({
    message: ERROR_PREFIX + JSON.stringify({ code, message, retryable }),
  });
}

/**
 * Parses a caught error back into the Docket error contract shape.
 *
 * @param error the caught unknown error
 * @returns the parsed contract with a safe fallback for foreign errors
 */
export function parseDocketError(error: unknown): DocketError {
  if (error instanceof Error && error.message.startsWith(ERROR_PREFIX)) {
    try {
      const parsed = JSON.parse(error.message.slice(ERROR_PREFIX.length)) as {
        code: string;
        message: string;
        retryable: boolean;
      };
      const isKnown = (Object.values(DocketErrorCodes) as string[]).includes(parsed.code);
      return {
        code: (isKnown ? parsed.code : DocketErrorCodes.PROVIDER_ERROR) as DocketErrorCode,
        message: parsed.message,
        retryable: Boolean(parsed.retryable),
      };
    } catch {
      // Fall through to the generic shape below.
    }
  }
  return {
    code: DocketErrorCodes.PROVIDER_ERROR,
    message: GENERIC_MESSAGE,
    retryable: false,
  };
}
