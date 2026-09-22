/** Formats a timestamp as a concise British date. */
export function formatDate(timestamp?: number, fallback = "Awaiting date"): string {
  if (!timestamp) return fallback;
  return new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", year: "numeric" }).format(timestamp);
}

/** Formats a timestamp with date and time for evidence retrieval details. */
export function formatDateTime(timestamp?: number): string {
  if (!timestamp) return "Not retrieved";
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(timestamp);
}

/** Converts a camel case or compact state label into readable text. */
export function formatState(value: string): string {
  return value.replace(/([a-z])([A-Z])/g, "$1 $2").replace(/^./, (letter) => letter.toUpperCase());
}
