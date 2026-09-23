/**
 * Builds the safe, unsent follow-up draft used by the demo and as the default
 * starting point for an obligation review.
 */
export function buildFollowUpDraft(
  title: string,
  actionText: string,
  dueDate: string,
  recipient: string,
) {
  return {
    to: [recipient],
    subject: `Response: ${title}`,
    bodyText: `Hello,\n\nI am writing about ${title.toLowerCase()}. I will ${actionText.toLowerCase()} by ${dueDate}.\n\nPlease confirm whether anything else is required.\n\nKind regards`,
  };
}
