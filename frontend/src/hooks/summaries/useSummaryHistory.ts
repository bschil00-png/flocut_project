"use client";

import { useEffect } from "react";
import { useQuery } from "@apollo/client/react";
import { SUMMARY_HISTORY_QUERY } from "@/lib/graphql/summary/summary.query";
import {
  SummaryHistoryPage,
  DocumentSummaryHistoryResponse,
} from "@/lib/graphql/summary/summary.type";

export function useSummaryHistory(
  fileId: number | null,
  sessionId: number,
  pageNumber: number = 0,
  pageSize: number = 10
) {
  const { data, loading, error, refetch, startPolling, stopPolling } =
    useQuery<DocumentSummaryHistoryResponse>(SUMMARY_HISTORY_QUERY, {
      variables: {
        fileId: fileId?.toString(),
        sessionId: sessionId.toString(),
        page: { page: pageNumber, size: pageSize },
      },
      skip: fileId == null,
      fetchPolicy: "network-only",
    });

  const history = data?.documentSummaryHistory?.content || [];

  //  생성 중인 히스토리가 하나라도 있으면 폴링 시작
  useEffect(() => {
    const hasProcessing = history.some((item) => item.status === "REQUESTED");
    if (hasProcessing) {
      startPolling(3000);
    } else {
      stopPolling();
    }
    return () => stopPolling();
  }, [history, startPolling, stopPolling]);

  return {
    history,
    page: data?.documentSummaryHistory,
    loading,
    error,
    refetch,
  };
}