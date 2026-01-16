"use client";

import { useEffect, useRef } from "react";
import { useQuery } from "@apollo/client/react";
import { SUMMARY_VIEW_BY_ID_QUERY } from "@/lib/graphql/summary/summary.query";
import { SummaryStatus, SummaryViewQueryResult } from "@/lib/graphql/summary/summary.type";

export function useDocumentSummaryState(
    summaryId?: number,
    onCompleted?: () => void
) {
    const prevStatusRef = useRef<SummaryStatus | null>(null);

    const {
        data,
        loading,
        startPolling,
        stopPolling,
        refetch,
    } = useQuery<SummaryViewQueryResult>(
        SUMMARY_VIEW_BY_ID_QUERY,
        {
            variables: { summaryId },
            skip: !summaryId,
            fetchPolicy: "cache-first",
        }
    );

    const summary = data?.documentSummaryViewBySummaryId ?? null;
    const status = summary?.status ?? null;

    useEffect(() => {
        if (!status) return;

        if (status === SummaryStatus.REQUESTED) {
            startPolling(3000);
        } else {
            stopPolling();
        }

        if (
            prevStatusRef.current === SummaryStatus.REQUESTED &&
            status === SummaryStatus.COMPLETED
        ) {
            onCompleted?.();
        }

        prevStatusRef.current = status;

        return () => stopPolling();
    }, [status, startPolling, stopPolling, onCompleted]);

    return {
        summary,
        status,
        loading,
        refetch,
    };
}
