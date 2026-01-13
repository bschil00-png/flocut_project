// 요약 상태
export enum SummaryStatus {
    REQUESTED = "REQUESTED",
    COMPLETED = "COMPLETED",
    FAILED = "FAILED",
    DELETED = "DELETED",
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

// 히스토리
export interface SummaryHistoryItem {
    summaryId: number;
    versionNo: number;
    status: SummaryStatus;
    createdAt: string;
}

export interface SummaryHistoryPage {
    content: SummaryHistoryItem[];
    totalElements: number;
    totalPages: number;
    pageNumber: number;
    pageSize: number;
    hasNext: boolean;
    hasPrevious: boolean;
    isFirst: boolean;
    isLast: boolean;
}

export interface SummaryHistoryQueryResult {
    documentSummaryHistory: SummaryHistoryPage;
}
