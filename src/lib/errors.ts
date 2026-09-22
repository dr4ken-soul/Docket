import type { ProviderError } from "./types";

/** Converts an unknown failure into Docket's safe user-facing error contract. */
export function normaliseError(error: unknown): ProviderError {
  if (error instanceof Error) {
    const match = error.message.match(/DOCKET_ERROR:(\{.*\})/);
    if (match) {
      try {
        return JSON.parse(match[1]) as ProviderError;
      } catch {
        return { code: "UNKNOWN", message: "Something went wrong. Please try again.", retryable: true };
      }
    }
  }
  return { code: "UNKNOWN", message: "Something went wrong. Please try again.", retryable: true };
}
