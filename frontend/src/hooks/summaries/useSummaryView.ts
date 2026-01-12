"use client";

import {
  SUMMARY_VIEW_BY_ID_QUERY,
} from "@/lib/graphql/summary/summary.query";
import {
  SummaryViewQueryResult,
} from "@/lib/graphql/summary/summary.type";
import {useQuery} from "@apollo/client/react";

export function useSummaryView(summaryId?: number) {
  const { data, loading, error, refetch } = useQuery<
    SummaryViewQueryResult
  >(SUMMARY_VIEW_BY_ID_QUERY, {
    variables: { summaryId },
    skip: !summaryId,
    fetchPolicy: "cache-and-network",
  });

  return {
    summary: data?.documentSummaryViewBySummaryId ?? null,
    loading,
    error,
    refetch,
  };
}
