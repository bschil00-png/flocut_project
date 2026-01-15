"use client";

import { useEffect } from "react";
import { useQuery } from "@apollo/client/react";
import { SUMMARY_VIEW_BY_ID_QUERY } from "@/lib/graphql/summary/summary.query";
import { SummaryViewQueryResult } from "@/lib/graphql/summary/summary.type";

export function useSummaryView(summaryId?: number) {
  const { data, loading, error, refetch, startPolling, stopPolling } =
    useQuery<SummaryViewQueryResult>(
      SUMMARY_VIEW_BY_ID_QUERY,
      {
        variables: { summaryId },
        skip: !summaryId,
        fetchPolicy: "network-only",
      }
    );

  const summary = data?.documentSummaryViewBySummaryId ?? null;

  // 현재 보고 있는 요약이 생성 중이면 폴링
  useEffect(() => {
    if (summary?.status === "REQUESTED") {
      startPolling(3000);
    } else {
      stopPolling();
    }
    return () => stopPolling();
  }, [summary?.status, startPolling, stopPolling]);

  return {
    summary,
    loading,
    error,
    refetch,
  };
}