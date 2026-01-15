"use client";

import { useEffect, useRef } from "react";
import { useQuery } from "@apollo/client/react";
import { NOTE_LATEST_SUMMARY_QUERY } from "@/lib/graphql/summary/summary.query";
import { SummaryStatus, SummaryView } from "@/lib/graphql/summary/summary.type";

interface Response {
    noteLatestSummary: SummaryView | null;
}

export function useNoteSummaryState(
    noteId: number,
    onCompleted?: () => void
) {
    const prevStatusRef = useRef<SummaryStatus | null>(null);

    const {
        data,
        loading,
        startPolling,
        stopPolling,
        refetch,
    } = useQuery<Response>(NOTE_LATEST_SUMMARY_QUERY, {
        variables: { noteId: noteId.toString() },
        fetchPolicy: "network-only",
    });

    const summary = data?.noteLatestSummary ?? null;
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
