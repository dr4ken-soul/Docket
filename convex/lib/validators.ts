import { v } from "convex/values";
import { resolveSourceExcerpt } from "./text";

/**
 * Convex validator for the raw LLM extraction JSON.
 */
export const extractionValidator = v.object({
  obligations: v.array(
    v.object({
      title: v.string(),
      actionText: v.string(),
      dueDateText: v.union(v.string(), v.null()),
      dueDateISO: v.union(v.string(), v.null()),
      dateCertainty: v.union(
        v.literal("exact"),
        v.literal("inferred"),
        v.literal("unresolved"),
        v.literal("none"),
      ),
      ownerLabel: v.union(v.string(), v.null()),
      sourceExcerpt: v.string(),
      confidence: v.union(v.literal("high"), v.literal("medium"), v.literal("low")),
      ambiguityNotes: v.union(v.string(), v.null()),
    }),
  ),
  notes: v.union(v.string(), v.null()),
});

export interface ValidatedObligation {
  title: string;
  actionText: string;
  dueAt: number | null;
  dueDateText: string | null;
  dateCertainty: "exact" | "inferred" | "unresolved" | "none";
  ownerLabel: string | null;
  confidence: "high" | "medium" | "low";
  ambiguityNotes: string | null;
  sourceExcerpt: string;
}

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

const DATE_CERTAINTY_VALUES = ["exact", "inferred", "unresolved", "none"] as const;
const CONFIDENCE_VALUES = ["high", "medium", "low"] as const;

function truncate(text: string, limit: number): string {
  return text.length <= limit ? text : text.slice(0, limit - 1).trimEnd() + "...";
}

interface RawObligation {
  title: string;
  actionText: string;
  dueDateText: string | null;
  dueDateISO: string | null;
  dateCertainty: (typeof DATE_CERTAINTY_VALUES)[number];
  ownerLabel: string | null;
  sourceExcerpt: string;
  confidence: (typeof CONFIDENCE_VALUES)[number];
  ambiguityNotes: string | null;
}

interface RawExtraction {
  obligations: RawObligation[];
  notes: string | null;
}

/**
 * Asserts that a value is a string.
 */
function asString(value: unknown): string {
  if (typeof value !== "string") {
    throw new Error("LLM_INVALID_JSON");
  }
  return value;
}

/**
 * Type guard for obligation date certainty values.
 */
function isDateCertainty(value: string): value is (typeof DATE_CERTAINTY_VALUES)[number] {
  return (DATE_CERTAINTY_VALUES as readonly string[]).includes(value);
}

/**
 * Type guard for obligation confidence values.
 */
function isConfidence(value: string): value is (typeof CONFIDENCE_VALUES)[number] {
  return (CONFIDENCE_VALUES as readonly string[]).includes(value);
}

/**
 * Validates the parsed LLM JSON against the extraction shape at runtime.
 * The Convex validator layer validates function arguments, not arbitrary
 * parsed payloads, so the structure is checked here.
 *
 * @param json the parsed JSON value
 * @returns the validated extraction shape
 */
export function validateExtraction(json: unknown): RawExtraction {
  if (typeof json !== "object" || json === null) {
    throw new Error("LLM_INVALID_JSON");
  }
  const obj = json as Record<string, unknown>;
  const obligationsRaw = obj.obligations;
  if (!Array.isArray(obligationsRaw)) {
    throw new Error("LLM_INVALID_JSON");
  }
  const obligations: RawObligation[] = obligationsRaw.map((item) => {
    if (typeof item !== "object" || item === null) {
      throw new Error("LLM_INVALID_JSON");
    }
    const entry = item as Record<string, unknown>;
    const dateCertainty = asString(entry.dateCertainty);
    if (!isDateCertainty(dateCertainty)) {
      throw new Error("LLM_INVALID_JSON");
    }
    const confidence = asString(entry.confidence);
    if (!isConfidence(confidence)) {
      throw new Error("LLM_INVALID_JSON");
    }
    return {
      title: asString(entry.title),
      actionText: asString(entry.actionText),
      dueDateText: entry.dueDateText === null ? null : asString(entry.dueDateText),
      dueDateISO: entry.dueDateISO === null ? null : asString(entry.dueDateISO),
      dateCertainty,
      ownerLabel: entry.ownerLabel === null ? null : asString(entry.ownerLabel),
      sourceExcerpt: asString(entry.sourceExcerpt),
      confidence,
      ambiguityNotes:
        entry.ambiguityNotes === null ? null : asString(entry.ambiguityNotes),
    };
  });
  const notes = obj.notes === null ? null : asString(obj.notes);
  return { obligations, notes };
}
/**
 * Parses and validates raw LLM output against the project schema.
 * Throws when the output is not structurally valid.
 *
 * @param rawText raw JSON text from the model
 * @param noticeBody the original notice, used to anchor source excerpts
 * @returns validated obligations and optional notes
 */
export function parseExtraction(
  rawText: string,
  noticeBody: string,
): { obligations: ValidatedObligation[]; notes: string | null } {
  let json: unknown;
  try {
    json = JSON.parse(rawText);
  } catch {
    throw new Error("LLM_INVALID_JSON");
  }
  const parsed = validateExtraction(json);
  const obligations = parsed.obligations.slice(0, 12).map((item) => {
    let dueAt: number | null = null;
    let dueDateText = item.dueDateText ? truncate(item.dueDateText, 120) : null;
    let dateCertainty = item.dateCertainty;
    if (item.dueDateISO && ISO_DATE.test(item.dueDateISO)) {
      const parsedDate = Date.parse(`${item.dueDateISO}T00:00:00Z`);
      if (!Number.isNaN(parsedDate)) {
        dueAt = parsedDate;
      }
    }
    if ((dateCertainty === "exact" || dateCertainty === "inferred") && dueAt === null) {
      dateCertainty = "unresolved";
    }
    if (dateCertainty === "none") {
      dueDateText = null;
    }
    return {
      title: truncate(item.title, 120),
      actionText: truncate(item.actionText, 500),
      dueAt,
      dueDateText,
      dateCertainty,
      ownerLabel: item.ownerLabel ? truncate(item.ownerLabel, 80) : null,
      confidence: item.confidence,
      ambiguityNotes: item.ambiguityNotes ? truncate(item.ambiguityNotes, 300) : null,
      sourceExcerpt: resolveSourceExcerpt(item.sourceExcerpt, noticeBody),
    };
  });
  return { obligations, notes: parsed.notes ? truncate(parsed.notes, 500) : null };
}
