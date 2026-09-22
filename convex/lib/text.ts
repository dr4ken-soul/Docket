/**
 * Text helpers shared by extraction, verification, and intake.
 */

const URL_PATTERN = /https?:\/\/[^\s"'<>()\]]+/gi;

const STOP_WORDS = new Set([
  "a", "an", "the", "and", "or", "but", "if", "then", "of", "to", "in", "on",
  "at", "by", "for", "with", "about", "against", "between", "through", "during",
  "before", "after", "above", "below", "from", "up", "down", "out", "off",
  "over", "under", "again", "further", "once", "here", "there", "when", "where",
  "why", "how", "all", "any", "both", "each", "few", "more", "most", "other",
  "some", "such", "no", "nor", "not", "only", "own", "same", "so", "than",
  "too", "very", "can", "will", "just", "is", "am", "are", "was", "were", "be",
  "been", "being", "have", "has", "had", "having", "do", "does", "did", "doing",
  "would", "should", "could", "ought", "i", "you", "he", "she", "it", "we",
  "they", "what", "which", "who", "whom", "this", "that", "these", "those",
  "as", "into", "upon", "per", "via",
]);

/**
 * Extracts candidate http(s) URLs from free text.
 *
 * @param text the source text
 * @returns unique URLs in order of appearance
 */
export function extractUrls(text: string): string[] {
  const matches = text.match(URL_PATTERN) ?? [];
  const seen = new Set<string>();
  const urls: string[] = [];
  for (const raw of matches) {
    const url = raw.replace(/[.,;:!?]+$/, "");
    if (!seen.has(url)) {
      seen.add(url);
      urls.push(url);
    }
  }
  return urls;
}

/**
 * Normalises case and whitespace for comparison.
 *
 * @param text the input text
 * @returns the normalised text
 */
function normalize(text: string): string {
  return text.toLowerCase().replace(/\s+/g, " ").trim();
}

/**
 * Splits text into sentences on terminal punctuation.
 *
 * @param text the input text
 * @returns an array of trimmed sentences
 */
function sentences(text: string): string[] {
  return text
    .replace(/\s+/g, " ")
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
}

/**
 * Extracts the meaningful terms from a piece of text.
 *
 * @param text the input text
 * @returns the set of content terms
 */
function terms(text: string): Set<string> {
  const out = new Set<string>();
  for (const word of normalize(text).split(" ")) {
    const cleaned = word.replace(/[^a-z0-9-]/g, "");
    if (cleaned.length >= 3 && !STOP_WORDS.has(cleaned)) {
      out.add(cleaned);
    }
  }
  return out;
}

/**
 * Scores how much of term set a is covered by term set b.
 *
 * @param a the terms to look for
 * @param b the terms to look in
 * @returns a ratio between 0 and 1
 */
function overlapScore(a: Set<string>, b: Set<string>): number {
  if (a.size === 0) return 0;
  let hits = 0;
  for (const term of a) {
    if (b.has(term)) hits += 1;
  }
  return hits / a.size;
}

/**
 * Truncates an excerpt to the retention limit.
 *
 * @param text the source text
 * @returns the trimmed and bounded excerpt
 */
export function clampExcerpt(text: string): string {
  const trimmed = text.trim();
  if (trimmed.length <= 500) return trimmed;
  return trimmed.slice(0, 497).trimEnd() + "...";
}

/**
 * Anchors a model supplied excerpt back to the original notice text.
 * Returns the excerpt when it appears verbatim, otherwise the closest
 * matching sentence from the notice.
 *
 * @param excerpt the model supplied excerpt
 * @param noticeBody the original notice text
 * @returns an excerpt guaranteed to come from the notice
 */
export function resolveSourceExcerpt(excerpt: string, noticeBody: string): string {
  const trimmed = excerpt.trim();
  if (trimmed.length === 0) {
    return clampExcerpt(noticeBody) || "No text available";
  }
  if (normalize(noticeBody).includes(normalize(trimmed))) {
    return clampExcerpt(trimmed);
  }
  const noticeSentences = sentences(noticeBody);
  const excerptTerms = terms(trimmed);
  let best = noticeSentences[0] ?? trimmed;
  let bestScore = 0;
  for (const sentence of noticeSentences) {
    const score = overlapScore(excerptTerms, terms(sentence));
    if (score > bestScore) {
      bestScore = score;
      best = sentence;
    }
  }
  return clampExcerpt(best);
}

export interface SupportingMatch {
  excerpt: string | null;
  score: number;
}

/**
 * Selects the sentence from a retrieved page that best supports the
 * obligation and scores how well the page matches it.
 *
 * @param obligationTitle the obligation title
 * @param obligationAction the obligation action text
 * @param pageText the retrieved page text
 * @returns the supporting excerpt and a match score between 0 and 1
 */
export function findSupportingExcerpt(
  obligationTitle: string,
  obligationAction: string,
  pageText: string,
): SupportingMatch {
  const obligationTerms = terms(`${obligationTitle} ${obligationAction}`);
  if (obligationTerms.size === 0) return { excerpt: null, score: 0 };
  const pageTerms = terms(pageText.slice(0, 30000));
  const score = overlapScore(obligationTerms, pageTerms);
  const pageSentences = sentences(pageText).slice(0, 400);
  let best: string | null = null;
  let bestScore = 0;
  for (const sentence of pageSentences) {
    if (sentence.length < 20) continue;
    const s = overlapScore(obligationTerms, terms(sentence));
    if (s > bestScore) {
      bestScore = s;
      best = sentence;
    }
  }
  if (!best || bestScore < 0.2) {
    return { excerpt: null, score };
  }
  return { excerpt: clampExcerpt(best), score: Math.max(score, bestScore) };
}
