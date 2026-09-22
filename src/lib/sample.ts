export const sampleNotice = {
  subject: "Permit renewal requires a response",
  bodyText: `Dear permit holder,\n\nYour annual street trading permit is due for renewal. Please provide proof of public liability insurance and a current site plan by 18 October. Reply to this notice with the documents attached. Current renewal guidance is available from the council licensing service.\n\nRegards,\nLicensing team`,
};

/** Builds a deterministic follow-up draft from an obligation. */
export function createDeterministicDraft(title: string, actionText: string, dueDate: string) {
  return {
    to: ["licensing@example.gov"],
    subject: `Response: ${title}`,
    bodyText: `Hello,\n\nI am writing about ${title.toLowerCase()}. I will ${actionText.toLowerCase()} by ${dueDate}.\n\nPlease confirm whether anything else is required.\n\nKind regards`,
  };
}
