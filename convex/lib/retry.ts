import { ERROR_PREFIX, DocketErrorCodes, parseDocketError } from "./errors";
import type { DocketErrorCode } from "./errors";

/**
 * Retries an async provider call with exponential backoff.
 *
 * @param fn the provider call to run
 * @param maxAttempts the maximum number of attempts
 * @returns the first successful result
 */
export async function withRetry<T>(fn: () => Promise<T>, maxAttempts = 3): Promise<T> {
  let lastError: unknown;
  for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      if (attempt < maxAttempts - 1) {
        const delay = 1000 * 2 ** attempt;
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }
  throw lastError;
}

export interface ClassifiedError {
  code: DocketErrorCode;
  message: string;
  retryable: boolean;
}

/**
 * Classifies a thrown provider error into the Docket error contract shape.
 *
 * @param error the caught error
 * @param fallbackCode the code to use when the error is not recognised
 * @returns the classified error
 */
export function classifyProviderError(
  error: unknown,
  fallbackCode: DocketErrorCode,
): ClassifiedError {
  if (error instanceof Error && error.message.startsWith(ERROR_PREFIX)) {
    return parseDocketError(error);
  }
  if (error instanceof Error) {
    switch (error.message) {
      case "LLM_NOT_CONFIGURED":
        return {
          code: DocketErrorCodes.PROVIDER_NOT_CONFIGURED,
          message:
            "The LLM provider is not configured. Set LLM_API_KEY on the deployed project and retry.",
          retryable: true,
        };
      case "LLM_EMPTY_RESPONSE":
        return {
          code: DocketErrorCodes.EXTRACT_INVALID,
          message: "The interpreter returned an empty response. Retry the processing.",
          retryable: true,
        };
      case "LLM_INVALID_JSON":
        return {
          code: DocketErrorCodes.EXTRACT_INVALID,
          message:
            "The interpreter returned a result Docket could not verify. Retry the processing.",
          retryable: true,
        };
      case "FIRECRAWL_INVALID_RESPONSE":
        return {
          code: DocketErrorCodes.CRAWL_FAILED,
          message: "Firecrawl returned an unreadable response. Retry the source check.",
          retryable: true,
        };
      default:
        break;
    }
  }
  return {
    code: fallbackCode,
    message: "The external service did not respond as expected. Retry when ready.",
    retryable: true,
  };
}
