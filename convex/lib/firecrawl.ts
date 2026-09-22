/**
 * Minimal Firecrawl scrape client for server side source verification.
 * Keys stay in the Convex environment and never reach the browser.
 */

export interface ScrapeResult {
  url: string;
  pageTitle: string | null;
  markdown: string;
  requestId: string | null;
}

const API_URL = "https://api.firecrawl.dev/v1/scrape";
const TIMEOUT_MS = 25000;

/**
 * Scrapes a URL through Firecrawl and returns the main content as markdown.
 *
 * @param url the page to retrieve
 * @returns the scrape result with title, markdown, and request id
 */
export async function scrapeUrl(url: string): Promise<ScrapeResult> {
  const apiKey = process.env.FIRECRAWL_API_KEY ?? "";
  if (!apiKey) {
    throw new Error("FIRECRAWL_NOT_CONFIGURED");
  }
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  let response: Response;
  try {
    response = await fetch(API_URL, {
      method: "POST",
      headers: {
        authorization: `Bearer ${apiKey}`,
        "content-type": "application/json",
      },
      body: JSON.stringify({ url, formats: ["markdown"], onlyMainContent: true }),
      signal: controller.signal,
    });
  } catch {
    if (controller.signal.aborted) {
      throw new Error("FIRECRAWL_TIMEOUT");
    }
    throw new Error("FIRECRAWL_UNREACHABLE");
  } finally {
    clearTimeout(timer);
  }
  if (response.status === 401 || response.status === 403) {
    throw new Error("FIRECRAWL_NOT_CONFIGURED");
  }
  if (response.status === 408 || response.status === 429 || response.status >= 500) {
    throw new Error("FIRECRAWL_TIMEOUT");
  }
  if (!response.ok) {
    throw new Error("FIRECRAWL_FAILED");
  }
  const data = (await response.json().catch(() => null)) as
    | {
        success?: boolean;
        data?: { markdown?: string; metadata?: { title?: string } };
        requestId?: string;
      }
    | null;
  if (!data || data.success === false || !data.data?.markdown) {
    throw new Error("FIRECRAWL_INVALID_RESPONSE");
  }
  return {
    url,
    pageTitle: data.data.metadata?.title ?? null,
    markdown: data.data.markdown,
    requestId: data.requestId ?? null,
  };
}
