"use client";

import { useEffect } from "react";
import { useQuery } from "@apollo/client/react";
import { SUMMARY_HISTORY_QUERY } from "@/lib/graphql/summary/summary.query";
import { DocumentSummaryHistoryResponse } from "@/lib/graphql/summary/summary.type";

export function useSummaryHistory(
  fileId: number | null,
  sessionId: number,
  pageNumber: number = 0,
  pageSize: number = 10
) {
  const {
    data,
    error,
    refetch,
    startPolling,
    stopPolling,
    networkStatus,
  } = useQuery<DocumentSummaryHistoryResponse>(SUMMARY_HISTORY_QUERY, {
    variables: {
      fileId: fileId?.toString(),
      sessionId: sessionId.toString(),
      page: { page: pageNumber, size: pageSize },
    },
    skip: fileId == null,
    fetchPolicy: "network-only",
    nextFetchPolicy: "network-only",
    notifyOnNetworkStatusChange: true,
  });

  const history = data?.documentSummaryHistory?.content ?? [];

  useEffect(() => {
    const hasProcessing = history.some(
      (item) => item.status === "REQUESTED"
    );

    if (hasProcessing) {
      console.log(" 폴링 시작 - REQUESTED 상태 감지");
      startPolling(3000);
    } else {
      console.log(" 폴링 중지 - 모든 요약 완료");
      stopPolling();
    }

    return () => stopPolling();
  }, [history, startPolling, stopPolling]);

  return {
    history,
    page: data?.documentSummaryHistory,
    loading: networkStatus === 1,
    error,
    refetch,
  };
}