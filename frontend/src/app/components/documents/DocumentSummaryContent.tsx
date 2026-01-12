"use client";

import SummaryContent from "@/app/components/summary/SummaryContent";
import { useSummaryHistory } from "@/hooks/summaries/useSummaryHistory";

type Props = {
  fileId: number;
  sessionId: number;
};

export default function DocumentSummaryContent({
                                                 fileId,
                                                 sessionId,
                                               }: Props) {
  const { history, loading, refetch } = useSummaryHistory(
    fileId,
    sessionId
  );

  return (
    <SummaryContent
      type="document"
      targetId={fileId}
      sessionId={sessionId}
      history={history}
      loadingHistory={loading}
      onRequestSuccess={refetch}
    />
  );
}
