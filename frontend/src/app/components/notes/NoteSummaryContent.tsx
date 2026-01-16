"use client";

import SummaryContent from "@/app/components/summary/SummaryContent";
import { useNoteSummary } from "@/hooks/summaries/useNoteSummary";

type Props = {
  noteId: string;
  sessionId: number;
  onNoteCreated?: (noteId: number) => void;
};

export default function NoteSummaryContent({
                                             noteId,
                                             sessionId,
                                             onNoteCreated,
                                           }: Props) {
  const id = Number(noteId);
  const { history, loading, refetch } = useNoteSummary(id);

  return (
    <SummaryContent
      type="note"
      targetId={id}
      sessionId={sessionId}
      history={history}
      loadingHistory={loading}
      onRequestSuccess={refetch}
      onNoteCreated={onNoteCreated}
    />
  );
}
