"use client";

import SummaryContent from "@/app/components/summary/SummaryContent";
import { useSummaryHistory } from "@/hooks/summaries/useSummaryHistory";

type Props = {
  noteId: string;
  sessionId: number;
};

export default function NoteSummaryContent({
                                             noteId,
                                             sessionId,
                                           }: Props) {
  const id = Number(noteId);

  const { history, loading, refetch } = useSummaryHistory(
    id,
    sessionId
  );

  return (
    <SummaryContent
      type="note"
      targetId={id}
      sessionId={sessionId}
      history={history}
      loadingHistory={loading}
      onRequestSuccess={refetch}
    />
  );
}
