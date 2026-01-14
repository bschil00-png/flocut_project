"use client";

import { NOTE_LATEST_SUMMARY_QUERY } from "@/lib/graphql/summary/summary.query";
import {
    SummaryHistoryItem,
    SummaryStatus,
    SummaryView,
} from "@/lib/graphql/summary/summary.type";
import {useQuery} from "@apollo/client/react";

type NoteLatestSummaryResponse = {
    noteLatestSummary: SummaryView | null;
};

// 노트 요약 조회 Hook (GraphQL)

export function useNoteSummary(noteId: number | null) {
    const { data, loading, error, refetch } =
        useQuery<NoteLatestSummaryResponse>(NOTE_LATEST_SUMMARY_QUERY, {
            variables: {
                noteId: noteId?.toString(),
            },
            skip: noteId == null,
            fetchPolicy: "cache-and-network",
        });

    const summary = data?.noteLatestSummary;

    // 요약이 있으면 히스토리 형태로 변환
    const history: SummaryHistoryItem[] = summary
        ? [
            {
                summaryId: summary.summaryId,
                versionNo: 1, // 노트는 항상 버전 1
                status: "COMPLETED" as SummaryStatus, // 조회 성공했으면 COMPLETED
                createdAt: new Date().toISOString(),
            },
        ]
        : [];

    return {
        history,
        loading,
        error,
        refetch,
    };
}