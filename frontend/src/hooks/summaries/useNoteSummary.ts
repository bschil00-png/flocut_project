"use client";

import {
  NOTE_SUMMARY_QUERY,
} from "@/lib/graphql/summary/summary.query";
import {
  NoteSummaryQueryResult,
} from "@/lib/graphql/summary/summary.type";
import {useQuery} from "@apollo/client/react";

interface Options {
  enabled?: boolean;
}

export function useNoteSummary(
  noteId: number,
  options?: Options
) {
  const { data, loading, refetch } =
    useQuery<NoteSummaryQueryResult>(
      NOTE_SUMMARY_QUERY,
      {
        variables: { noteId },
        skip: options?.enabled === false || !noteId,
        fetchPolicy: "network-only",
      }
    );

  return {
    summary: data?.noteSummaryByNoteId ?? null,
    loading,
    refetch,
  };
}
