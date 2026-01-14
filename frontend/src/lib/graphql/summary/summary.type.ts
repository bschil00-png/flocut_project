// lib/graphql/summary/summary.type.ts

// ==================== 요약 상태 ====================
export enum SummaryStatus {
    REQUESTED = "REQUESTED",
    COMPLETED = "COMPLETED",
    FAILED = "FAILED",
    DELETED = "DELETED",
}

// ==================== 요약 섹션 ====================
export interface SummarySection {
    title: string;
    content: string;
}

// ==================== 요약 상세 뷰 ====================
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

// ==================== 요약 확인 (노트용) ====================
export type CheckSummaryResponse = {
    hasSummary: boolean;
    summaryId: number | null;
    status: SummaryStatus | null;
};

// ==================== 요약 히스토리 ====================
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

//  문서 요약 히스토리 응답
export interface DocumentSummaryHistoryResponse {
    documentSummaryHistory: SummaryHistoryPage;
}

//  노트 요약 히스토리 응답
export interface NoteSummaryHistoryResponse {
    noteSummaryHistory: SummaryHistoryPage;
}

//  통합 히스토리 쿼리 결과 (Union Type)
export type SummaryHistoryQueryResult =
    | DocumentSummaryHistoryResponse
    | NoteSummaryHistoryResponse;