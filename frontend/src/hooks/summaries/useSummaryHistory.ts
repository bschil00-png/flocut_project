"use client";

import { useQuery } from "@apollo/client/react";
import { SUMMARY_HISTORY_QUERY } from "@/lib/graphql/summary/summary.query";
import { SummaryHistoryQueryResult } from "@/lib/graphql/summary/summary.type";

export function useSummaryHistory(
    fileId?: number,
    sessionId?: number,
    page = 0,
    size = 10
) {
    const { data, loading, error, refetch } =
        useQuery<SummaryHistoryQueryResult>(
            SUMMARY_HISTORY_QUERY,
            {
                variables: {
                    fileId,
                    sessionId,
                    page: { page, size },
                },
                skip: !fileId || !sessionId,
                fetchPolicy: "cache-and-network",
            }
        );

    return {
        history: data?.documentSummaryHistory.content ?? [],
        pageInfo: data?.documentSummaryHistory,
        loading,
        error,
        refetch,
    };
}
