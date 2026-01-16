"use client";

import { useEffect } from "react";
import { useQuery } from "@apollo/client/react";
import { SUMMARY_VIEW_BY_ID_QUERY } from "@/lib/graphql/summary/summary.query";
import { SummaryViewQueryResult } from "@/lib/graphql/summary/summary.type";

export function useSummaryView(summaryId?: number) {
  const {
    data,
    error,
    refetch,
    startPolling,
    stopPolling,
    networkStatus,
  } = useQuery<SummaryViewQueryResult>(SUMMARY_VIEW_BY_ID_QUERY, {
    variables: { summaryId },
    skip: !summaryId,
    //  캐시 정책 변경
    fetchPolicy: "network-only",
    nextFetchPolicy: "network-only",
    notifyOnNetworkStatusChange: true,
  });

  const summary = data?.documentSummaryViewBySummaryId ?? null;

  useEffect(() => {
    if (summary?.status === "REQUESTED") {
      console.log(` 폴링 시작 - Summary ${summaryId} 생성 중`);
      startPolling(3000);
    } else {
      stopPolling();
    }

    return () => stopPolling();
  }, [summary?.status, summaryId, startPolling, stopPolling]);

  return {
    summary,
    loading: networkStatus === 1,
    error,
    refetch,
  };
}
