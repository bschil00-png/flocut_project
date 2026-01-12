"use client";

import {
  SUMMARY_HISTORY_QUERY,
} from "@/lib/graphql/summary/summary.query";
import { SummaryStatus } from "@/lib/graphql/summary/summary.type";
import {useQuery} from "@apollo/client/react";

interface SummaryHistoryItem {
  summaryId: number;
  versionNo: number;
  status: SummaryStatus;
  createdAt: string;
}

interface SummaryHistoryPage {
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

interface SummaryHistoryQueryResult {
  documentSummaryHistory: SummaryHistoryPage;
}

export function useSummaryHistory(
  fileId?: number,
  sessionId?: number,
  page = 0,
  size = 10
) {
  const { data, loading, error, refetch } = useQuery<
    SummaryHistoryQueryResult
  >(SUMMARY_HISTORY_QUERY, {
    variables: {
      fileId,
      sessionId,
      page: { page, size },
    },
    skip: !fileId || !sessionId,
    fetchPolicy: "cache-and-network",
  });

  return {
    history: data?.documentSummaryHistory.content ?? [],
    pageInfo: data?.documentSummaryHistory,
    loading,
    error,
    refetch,
  };
}
