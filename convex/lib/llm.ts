import OpenAI from "openai";

const SYSTEM_PROMPT = `You are Docket's notice interpreter. Read the official notice and extract every concrete obligation it contains. An obligation is a specific action someone must take, such as submitting a document, paying a fee, confirming a form, or attending an appointment.

Respond with JSON only. Use exactly this shape:

{
  "obligations": [
    {
      "title": "short action title, maximum 8 words",
      "actionText": "one or two sentences saying exactly what the person must do",
      "dueDateText": "the due date exactly as written in the notice, or null",
      "dueDateISO": "the due date as YYYY-MM-DD when it can be determined, otherwise null",
      "dateCertainty": "one of exact, inferred, unresolved, none",
      "ownerLabel": "the person or role who must act, or null",
      "sourceExcerpt": "the exact sentence or sentences copied verbatim from the notice that state this obligation",
      "confidence": "one of high, medium, low",
      "ambiguityNotes": "what is unclear about this obligation, or null"
    }
  ],
  "notes": "anything important in the notice that is not an obligation, or null"
}

Rules:
- Copy sourceExcerpt verbatim from the notice. Do not paraphrase it.
- Never invent a date. If the notice only says soon, ASAP or similar, set dateCertainty to unresolved and dueDateISO to null.
- If a date is written in a normal calendar form, set dateCertainty to exact. If you had to combine a relative phrase with the notice date to work it out, set dateCertainty to inferred.
- Do not give advice. Extract requirements only.
- If the notice contains no actionable obligation, return an empty obligations array.`;

/**
 * Builds the LLM client for the configured provider, or null when no key is set.
 *
 * @returns a configured OpenAI compatible client or null
 */
export function createLlmClient(): OpenAI | null {
  const apiKey = process.env.LLM_API_KEY ?? "";
  if (!apiKey) return null;
  return new OpenAI({
    baseURL: process.env.LLM_BASE_URL ?? "https://api.groq.com/openai/v1",
    apiKey,
  });
}

/**
 * Returns the configured model name for the active provider.
 *
 * @returns the model name
 */
export function llmModel(): string {
  const base = (process.env.LLM_BASE_URL ?? "").toLowerCase();
  const defaultModel = base.includes("groq") ? "llama-3.3-70b-versatile" : "gpt-4o-mini";
  return process.env.LLM_MODEL ?? defaultModel;
}

/**
 * Sends the notice to the configured LLM and returns the raw JSON text.
 *
 * @param noticeSubject the original subject line
 * @param noticeBody the original notice text
 * @returns the raw JSON response text
 */
export async function extractObligations(
  noticeSubject: string,
  noticeBody: string,
): Promise<string> {
  const client = createLlmClient();
  if (!client) {
    throw new Error("LLM_NOT_CONFIGURED");
  }
  const completion = await client.chat.completions.create({
    model: llmModel(),
    temperature: 0,
    response_format: { type: "json_object" },
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      {
        role: "user",
        content: `Notice subject: ${noticeSubject}\n\nNotice body:\n${noticeBody.slice(0, 12000)}`,
      },
    ],
  });
  const content = completion.choices[0]?.message?.content ?? "";
  if (!content) {
    throw new Error("LLM_EMPTY_RESPONSE");
  }
  return content;
}
