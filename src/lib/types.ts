export type DocketFilter = "open" | "dueSoon" | "waiting" | "complete";
export type VerificationState = "pending" | "supported" | "partiallySupported" | "unableToVerify";
export type ObligationStatus = "open" | "review" | "ready" | "waiting" | "complete" | "archived";

export interface DocketObligation {
  _id: string;
  noticeId: string;
  title: string;
  actionText: string;
  status: ObligationStatus;
  dueAt?: number;
  dueDateText?: string;
  dateCertainty: "exact" | "inferred" | "unresolved" | "none";
  ownerLabel?: string;
  confidence: "high" | "medium" | "low";
  ambiguityNotes?: string;
  sourceExcerpt: string;
  updatedAt: number;
}

export interface NoticeSummary {
  _id: string;
  subject: string;
  sender?: string;
  sourceType: "agentmail" | "paste";
  processingState: "received" | "processing" | "complete" | "failed";
  processingError?: string;
  receivedAt: number;
}

export interface EvidenceRecord {
  _id: string;
  verificationState: VerificationState;
  url?: string;
  pageTitle?: string;
  supportingExcerpt?: string;
  retrievedAt?: number;
  failureReason?: string;
}

export interface ActivityEvent {
  _id: string;
  kind: string;
  label: string;
  createdAt: number;
}

export interface EmailDraft {
  _id: string;
  obligationId: string;
  to: string[];
  subject: string;
  bodyText: string;
  status: "draft" | "approved" | "sending" | "sent" | "failed";
  failureReason?: string;
  updatedAt: number;
}

export interface ObligationDetail {
  obligation: DocketObligation;
  evidence: EvidenceRecord[];
  activity: ActivityEvent[];
  draft?: EmailDraft;
}

export interface ProviderError {
  code: string;
  message: string;
  retryable: boolean;
}
