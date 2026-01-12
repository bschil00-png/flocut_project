// 요약 상태 Enum
export enum SummaryStatus {
  REQUESTED = "REQUESTED",
  COMPLETED = "COMPLETED",
  FAILED = "FAILED",
}

export interface SummarySection {
  title: string;
  content: string;
}

export interface SummaryView {
  summaryId: number;
  mainTopic?: string | null;
  keyTakeaways?: string[] | null;
  sections?: SummarySection[] | null;
  finalDocument?: string | null;
}

export interface SummaryViewQueryResult {
  documentSummaryViewBySummaryId: SummaryView | null;
}


// 문서 요약 타입


export interface DocumentSummary {
  summaryId: number;
  fileId: number;
  sessionId: number;
  status: SummaryStatus;
  summaryText: string | null;
  summaryOption?: string | null;
  modelVersion: string | null;
  versionNo: number;
  regdate: string;
}

export interface DocumentSummaryQueryResult {
  documentSummaryByFileId: DocumentSummary | null;
}


// 노트 요약 타입
export interface NoteSummary {
  summaryId: number;
  noteId: number;
  sessionId: number;
  status: SummaryStatus;
  summaryText: string | null;
  summaryOption?: string | null;
  modelVersion: string | null;
  versionNo: number;
  regdate: string;
}

export interface NoteSummaryQueryResult {
  noteSummaryByNoteId: NoteSummary | null;
}


// 공용 타입 (UI에서 사용)
export type AnySummary = DocumentSummary | NoteSummary;