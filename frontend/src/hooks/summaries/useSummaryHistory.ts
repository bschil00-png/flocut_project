"use client";

import { SUMMARY_HISTORY_QUERY } from "@/lib/graphql/summary/summary.query";
import {
    SummaryHistoryPage,
    DocumentSummaryHistoryResponse,
} from "@/lib/graphql/summary/summary.type";
import {useQuery} from "@apollo/client/react";


  // 문서 요약 히스토리 조회 Hook
  // - 문서 전용 (노트는 useNoteSummary 사용)
  // - 버전 관리, 페이지네이션 지원
export function useSummaryHistory(
    fileId: number | null,
    sessionId: number,
    pageNumber: number = 0,
    pageSize: number = 10
) {
    const { data, loading, error, refetch } =
        useQuery<DocumentSummaryHistoryResponse>(SUMMARY_HISTORY_QUERY, {
            variables: {
                fileId: fileId?.toString(),
                sessionId: sessionId.toString(),
                page: {
                    page: pageNumber,
                    size: pageSize,
                },
            },
            skip: fileId == null,
            fetchPolicy: "cache-and-network",
        });

    const historyPage: SummaryHistoryPage | undefined =
        data?.documentSummaryHistory;

    return {
        history: historyPage?.content || [],
        page: historyPage,
        loading,
        error,
        refetch,
    };
}