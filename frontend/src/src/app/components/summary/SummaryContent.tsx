"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Loader2 } from "lucide-react";

import { SummaryStatus } from "@/lib/graphql/summary/summary.type";
import { useSummaryView } from "@/hooks/summaries/useSummaryView";
import { useMediaQuery } from "@/hooks/common/useMediaQuery";

import SummaryEmptyState from "./SummaryEmptyState";
import SummaryProcessing from "./SummaryProcessing";
import SummarySkeleton from "./SummarySkeleton";
import SummaryVersionGrid from "./SummaryVersionGrid";
import SummaryActions from "./SummaryActions";
import SummaryRequestButton from "./SummaryRequestButton";
import DownloadButton from "@/app/components/notes/download/DownloadButton";
import SummaryFormatRenderer from "@/app/components/summary/Summaryformatrenderer";


type SummaryHistoryItem = {
  summaryId: number;
  versionNo: number;
  status: SummaryStatus;
  createdAt: string;
};

type Props = {
  type: "document" | "note";
  targetId: number;
  sessionId: number;
  history: SummaryHistoryItem[];
  loadingHistory: boolean;
  onRequestSuccess: () => void;
  onNoteCreated?: (noteId: number) => void;
};

const PAGE_SIZE = 6;

export default function SummaryContent({
                                         type,
                                         targetId,
                                         sessionId,
                                         history,
                                         loadingHistory,
                                         onRequestSuccess,
                                         onNoteCreated,
                                       }: Props) {
  const isMobile = useMediaQuery("(max-width: 768px)");

  const [selectedSummaryId, setSelectedSummaryId] = useState<number | null>(null);
  const initializedRef = useRef(false);
  const previousHistoryLengthRef = useRef(0);

  // 초기 선택 + 새 요약 생성 시 자동 선택
  useEffect(() => {
    if (type !== "document") return;
    if (history.length === 0) return;

    // 새 요약이 추가되었는지 확인
    const isNewSummaryAdded = history.length > previousHistoryLengthRef.current;
    previousHistoryLengthRef.current = history.length;

    const latestCompleted = history.find(
      (h) => h.status === SummaryStatus.COMPLETED
    );

    if (!latestCompleted) return;

    // 초기 로딩이거나 새 요약이 추가된 경우에만 자동 선택
    if (!initializedRef.current) {
      setSelectedSummaryId(latestCompleted.summaryId);
      initializedRef.current = true;
      return;
    }

    // 새 요약이 추가되고 완료되면 자동 선택
    if (isNewSummaryAdded && latestCompleted.summaryId !== selectedSummaryId) {
      setSelectedSummaryId(latestCompleted.summaryId);
    }
  }, [type, history, selectedSummaryId]);

  const summaryId =
    type === "document"
      ? selectedSummaryId ?? undefined
      : history[0]?.summaryId;

  const { summary: detail, loading: loadingDetail } = useSummaryView(summaryId);

  const hasProcessing = history.some(
    (item) => item.status === SummaryStatus.REQUESTED
  );

  const totalPages = Math.ceil(history.length / PAGE_SIZE);
  const visibleItems = useMemo(() => history.slice(0, PAGE_SIZE), [history]);

  // 초기 로딩만 skeleton (폴링 중엔 기존 UI 유지)
  if (loadingHistory && history.length === 0) {
    return <SummarySkeleton />;
  }

  if (history.length === 0) {
    return (
      <SummaryEmptyState
        type={type}
        targetId={targetId}
        sessionId={sessionId}
        onRequested={onRequestSuccess}
      />
    );
  }

  return (
    <div className="h-full flex flex-col min-w-0">
      {/* header */}
      <div className="flex items-center justify-between px-4 py-3 border-b">
        <h3 className="text-sm font-bold">
          {type === "note" ? "노트 요약" : "요약 내역"}
        </h3>

        <div className="flex items-center gap-2">
          {detail && !hasProcessing && (
            <DownloadButton
              title={
                type === "note"
                  ? "노트 요약"
                  : `요약 v${detail.summaryId}`
              }
              content={detail.finalDocument ?? ""}
            />
          )}

          <SummaryRequestButton
            type={type}
            targetId={targetId}
            sessionId={sessionId}
            size="sm"
            onRequested={onRequestSuccess}
          />
        </div>
      </div>

      {/* DOCUMENT 전용 그리드 - 모든 요약 내역 표시 */}
      {type === "document" && !isMobile && (
        <SummaryVersionGrid
          items={visibleItems}
          selectedId={selectedSummaryId}
          page={0}
          totalPages={totalPages}
          onSelect={setSelectedSummaryId}
          onPageChange={() => {}}
          onRefetch={onRequestSuccess}
        />
      )}

      {/* body */}
      <div className="flex-1 min-h-0 overflow-y-auto p-4 custom-scrollbar">
        {/* 처리 중인데 아직 선택된 요약이 없을 때만 Processing 표시 */}
        {hasProcessing && !selectedSummaryId ? (
          <SummaryProcessing />
        ) : loadingDetail ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-10 h-10 animate-spin" />
          </div>
        ) : detail ? (
          <div className="space-y-6">
            <SummaryActions
              summaryId={detail.summaryId}
              sessionId={sessionId}
              onNoteCreated={onNoteCreated}
              onDeleted={() => {
                if (type === "document") {
                  setSelectedSummaryId(null);
                  initializedRef.current = false;
                }
                onRequestSuccess();
              }}
            />
            <SummaryFormatRenderer {...detail} />
          </div>
        ) : null}
      </div>
    </div>
  );
}
