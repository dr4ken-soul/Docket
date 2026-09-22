import { v } from "convex/values";
import { internal } from "./_generated/api";
import { internalAction } from "./_generated/server";
import { extractObligations } from "./lib/llm";
import { parseExtraction } from "./lib/validators";
import { withRetry, classifyProviderError } from "./lib/retry";
import { scrapeUrl } from "./lib/firecrawl";
import { extractUrls, findSupportingExcerpt } from "./lib/text";
import { DocketErrorCodes } from "./lib/errors";

/**
 * Marks a notice as failed with a safe user-facing error message.
 */
function failNotice(
  ctx: import("./_generated/server").ActionCtx,
  noticeId: string,
  error: unknown,
) {
  const classified = classifyProviderError(error, DocketErrorCodes.PROVIDER_ERROR);
  return ctx.runMutation(internal.notices.updateProcessingState, {
    noticeId: noticeId as never,
    state: "failed",
    error: classified.message,
  });
}

/**
 * Internal action that interprets a notice with the LLM, validates the
 * structured result, and persists one obligation per extracted action. Then
 * schedules a Firecrawl verification for each obligation.
 */
export const extractNotice = internalAction({
  args: { noticeId: v.id("notices") },
  handler: async (ctx, args) => {
    const notice = await ctx.runQuery(internal.notices.getInternal, {
      noticeId: args.noticeId,
    });
    if (!notice) {
      return { skipped: true as const };
    }

    await ctx.runMutation(internal.notices.updateProcessingState, {
      noticeId: args.noticeId,
      state: "processing",
    });

    const startedAt = Date.now();
    let obligationIds: string[];
    try {
      const raw = await withRetry(
        () => extractObligations(notice.subject, notice.bodyText),
        3,
      );
      const { obligations, notes } = parseExtraction(raw, notice.bodyText);
      if (obligations.length === 0) {
        obligationIds = [];
      } else {
        obligationIds = await ctx.runMutation(
          internal.obligations.createFromExtraction,
          {
            noticeId: notice._id,
            obligations: obligations.map((item) => ({
              title: item.title,
              actionText: item.actionText,
              dueAt: item.dueAt,
              dueDateText: item.dueDateText,
              dateCertainty: item.dateCertainty,
              ownerLabel: item.ownerLabel,
              confidence: item.confidence,
              ambiguityNotes: item.ambiguityNotes,
              sourceExcerpt: item.sourceExcerpt,
            })),
            notes: notes ?? undefined,
          },
        );
      }
      await ctx.runMutation(internal.notices.updateProcessingState, {
        noticeId: notice._id,
        state: "complete",
      });
      for (const obligationId of obligationIds) {
        await ctx.scheduler.runAfter(0, internal.processing.verifyObligation, {
          obligationId: obligationId as never,
        });
      }
      return { obligationIds, startedAt };
    } catch (error) {
      await failNotice(ctx, notice._id, error);
      throw error;
    }
  },
});

/**
 * Internal action that verifies one obligation against an official source.
 * Extracts a candidate URL from the notice, retrieves it with Firecrawl, and
 * records supporting evidence. A crawl failure produces `unableToVerify`
 * without deleting the original obligation.
 */
export const verifyObligation = internalAction({
  args: { obligationId: v.id("obligations") },
  handler: async (ctx, args) => {
    const obligation = await ctx.runQuery(internal.obligations.getInternal, {
      obligationId: args.obligationId,
    });
    if (!obligation || !obligation.noticeId) {
      return { skipped: true as const };
    }

    const notice = await ctx.runQuery(internal.notices.getInternal, {
      noticeId: obligation.noticeId,
    });

    const candidatePool = extractUrls(
      `${notice?.bodyText ?? ""} ${obligation.sourceExcerpt}`,
    );
    const url = candidatePool[0];

    const evidenceId = await ctx.runMutation(internal.evidence.createPending, {
      obligationId: args.obligationId,
      url,
    });
    if (!evidenceId) {
      return { skipped: true as const };
    }

    if (!url) {
      await ctx.runMutation(internal.evidence.recordResult, {
        evidenceId: evidenceId as never,
        verificationState: "unableToVerify",
        failureReason: "No official source URL found in the notice.",
      });
      return { verificationState: "unableToVerify" as const };
    }

    try {
      const result = await withRetry(() => scrapeUrl(url), 3);
      const match = findSupportingExcerpt(
        obligation.title,
        obligation.actionText,
        result.markdown,
      );
      const verificationState =
        match.excerpt && match.score >= 0.5
          ? "supported"
          : match.excerpt
            ? "partiallySupported"
            : "unableToVerify";
      await ctx.runMutation(internal.evidence.recordResult, {
        evidenceId: evidenceId as never,
        verificationState,
        pageTitle: result.pageTitle ?? undefined,
        supportingExcerpt: match.excerpt ?? undefined,
        providerRequestId: result.requestId ?? undefined,
      });
      return { verificationState, url };
    } catch (error) {
      const classified = classifyProviderError(error, DocketErrorCodes.CRAWL_FAILED);
      await ctx.runMutation(internal.evidence.recordResult, {
        evidenceId: evidenceId as never,
        verificationState: "unableToVerify",
        failureReason: classified.message,
      });
      return { verificationState: "unableToVerify" as const, error: classified.message };
    }
  },
});
