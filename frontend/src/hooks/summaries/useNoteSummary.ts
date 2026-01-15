import { useQuery } from "@apollo/client/react";
import {SummaryStatus, SummaryView} from "@/lib/graphql/summary/summary.type";
import {NOTE_LATEST_SUMMARY_QUERY} from "@/lib/graphql/summary/summary.query";
import {useEffect} from "react";

interface NoteLatestSummaryResponse {
  noteLatestSummary: SummaryView | null;
}

export function useNoteSummary(noteId: number | null) {
  const { data, loading, error, refetch, startPolling, stopPolling } =
    useQuery<NoteLatestSummaryResponse>(NOTE_LATEST_SUMMARY_QUERY, {
      variables: { noteId: noteId?.toString() },
      skip: noteId == null,
      fetchPolicy: "network-only",
    });

  const summary = data?.noteLatestSummary;

  useEffect(() => {
    if (summary?.status === "REQUESTED") {
      startPolling(3000);
    } else {
      stopPolling();
    }
    return () => stopPolling();
  }, [summary?.status, startPolling, stopPolling]);


  const history = summary ? [{
    summaryId: Number(summary.summaryId),
    versionNo: 1,
    status: summary.status as SummaryStatus,
    createdAt: new Date().toISOString(),
  }] : [];

  return { history, loading, error, refetch };
}