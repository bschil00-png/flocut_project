export enum SummaryStatus {
    REQUESTED = "REQUESTED",
    COMPLETED = "COMPLETED",
    FAILED = "FAILED",
}

export interface DocumentSummary {
    summaryId: number;
    fileId: number;
    status: SummaryStatus;
    summaryText: string | null;
    modelVersion: string | null;
}

export interface DocumentSummaryQueryResult {
    documentSummaryByFileId: DocumentSummary | null;
}

export interface DocumentSummaryRequest {
    fileId: number;
    sessionId: number;
}