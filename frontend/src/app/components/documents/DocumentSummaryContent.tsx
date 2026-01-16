"use client";

import SummaryContent from "@/app/components/summary/SummaryContent";
import { useSummaryHistory } from "@/hooks/summaries/useSummaryHistory";
import { useCallback } from "react";

type Props = {
  fileId: number;
  sessionId: number;
  onNoteCreated?: (noteId: number) => void;
};

export default function DocumentSummaryContent({
                                                 fileId,
                                                 sessionId,
                                                 onNoteCreated,
                                               }: Props) {
  const { history, loading, refetch } = useSummaryHistory(fileId, sessionId);

  //  요청 후 즉시 강제 refetch
  const handleRequestSuccess = useCallback(async () => {
    console.log(" 요약 요청 완료 - 즉시 refetch 시작");

    // 약간의 딜레이 후 refetch (서버 DB 반영 대기)
    await new Promise(resolve => setTimeout(resolve, 500));

    await refetch();
    console.log(" Refetch 완료");
  }, [refetch]);

  return (
    <SummaryContent
      type="document"
      targetId={fileId}
      sessionId={sessionId}
      history={history}
      loadingHistory={loading}
      onRequestSuccess={handleRequestSuccess}
      onNoteCreated={onNoteCreated}
    />
  );
}