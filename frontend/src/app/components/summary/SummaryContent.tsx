"use client";

import { useEffect, useState } from "react";
import { Loader2, Sparkles } from "lucide-react";

import { SummaryStatus } from "@/lib/graphql/summary/summary.type";
import { useSummaryView } from "@/hooks/summaries/useSummaryView";

import SummaryRequestButton from "@/app/components/shared/SummaryRequestButton";
import SummaryActions from "./SummaryActions";
import { SummaryStatusBadge } from "./SummaryStatusBadge";

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
};


export default function SummaryContent({
                                         type,
                                         targetId,
                                         sessionId,
                                         history,
                                         loadingHistory,
                                         onRequestSuccess,
                                       }: Props) {
  const [selectedSummaryId, setSelectedSummaryId] = useState<number | null>(
    null
  );


  const selectedHistoryItem = history.find(
    (h) => h.summaryId === selectedSummaryId
  );

  const {
    summary: detail,
    loading: loadingDetail,
  } = useSummaryView(selectedSummaryId ?? undefined);


  useEffect(() => {
    if (!selectedSummaryId && history.length > 0) {
      setSelectedSummaryId(history[0].summaryId);
    }
  }, [history, selectedSummaryId]);


  if (loadingHistory) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="animate-spin text-accent" size={32} />
      </div>
    );
  }


  if (history.length === 0) {
    return (
      <div className="p-6 space-y-6">
        {/* 헤더 */}
        <div className="flex items-center justify-between border-b pb-4">
          <div className="flex items-center gap-2">
            <Sparkles size={20} className="text-accent" />
            <h4 className="font-bold text-lg">AI 요약</h4>
          </div>

          <SummaryRequestButton
            type={type}
            targetId={targetId}
            sessionId={sessionId}
            onRequested={onRequestSuccess}
          />
        </div>

        {/* 빈 상태 */}
        <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed rounded-3xl">
          <Sparkles size={48} className="text-accent opacity-20 mb-4" />
          <p className="text-sm text-text-muted-light">
            아직 생성된 요약이 없습니다
          </p>
        </div>
      </div>
    );
  }


  return (
    <div className="flex h-full">

      <aside className="w-64 border-r border-border-light p-4 space-y-2">
        <div className="flex items-center justify-between mb-3">
          <h5 className="font-bold text-sm">요약 내역</h5>

          <SummaryRequestButton
            type={type}
            targetId={targetId}
            sessionId={sessionId}
            size="sm"
            onRequested={onRequestSuccess}
          />
        </div>

        {history.map((item) => {
          const selected = selectedSummaryId === item.summaryId;

          return (
            <button
              key={item.summaryId}
              onClick={() => setSelectedSummaryId(item.summaryId)}
              className={`
                w-full text-left p-3 rounded-lg border text-sm space-y-1
                transition-colors
                ${
                selected
                  ? "border-accent bg-accent-soft"
                  : "border-border-light hover:bg-surface-light"
              }
              `}
            >
              <div className="flex items-center justify-between">
                <span className="font-medium">v{item.versionNo}</span>
                <SummaryStatusBadge status={item.status} />
              </div>

              <p className="text-xs text-text-muted-light">
                {new Date(item.createdAt).toLocaleString("ko-KR")}
              </p>
            </button>
          );
        })}
      </aside>


      <section className="flex-1 p-6 overflow-y-auto">
        {loadingDetail ? (
          <div className="flex justify-center py-20">
            <Loader2 className="animate-spin text-accent" size={32} />
          </div>
        ) : !detail ? (
          <p className="text-sm text-text-muted-light">
            왼쪽에서 요약을 선택하세요
          </p>
        ) : (
          <div className="space-y-6">
            {/* 헤더 */}
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-lg">
                요약 상세 (v{selectedHistoryItem?.versionNo})
              </h4>

              {/* 요약 → 노트 생성 액션 */}
              <SummaryActions
                summaryId={detail.summaryId}
                sessionId={sessionId}
              />
            </div>

            {/* 본문 */}
            <div className="border border-border-light rounded-2xl p-6 bg-surface-light">
              <p className="whitespace-pre-wrap text-sm leading-relaxed">
                {detail.finalDocument}
              </p>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
