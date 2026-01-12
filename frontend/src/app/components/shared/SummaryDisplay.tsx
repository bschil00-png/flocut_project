"use client";

import { Loader2, Sparkles, AlertCircle } from "lucide-react";
import { SummaryStatus } from "@/lib/graphql/summary/summary.type";
import { useDocumentSummary } from "@/hooks/summaries/useDocumentSummary";
import { useNoteSummary } from "@/hooks/summaries/useNoteSummary";
import SummaryRequestButton from "./SummaryRequestButton";

interface Props {
  type: "document" | "note";
  targetId: number;
  sessionId: number;
}

export default function SummaryDisplay({
                                         type,
                                         targetId,
                                         sessionId,
                                       }: Props) {
  //  조건은 훅 내부에서 제어 (skip / enabled)
  const documentQuery = useDocumentSummary(targetId, {
    enabled: type === "document",
  });

  const noteQuery = useNoteSummary(targetId, {
    enabled: type === "note",
  });

  const {
    summary,
    loading,
    refetch,
  } = type === "document" ? documentQuery : noteQuery;

  /* =========================
     로딩
     ========================= */
  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="animate-spin text-accent" size={32} />
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* 헤더 */}
      <div className="flex items-center justify-between border-b pb-4">
        <div className="flex items-center gap-2">
          <Sparkles size={20} className="text-accent" />
          <h4 className="font-bold text-lg">AI 요약</h4>
        </div>

        {/* 요약이 아예 없을 때만 요청 버튼 */}
        {!summary && (
          <SummaryRequestButton
            type={type}
            targetId={targetId}
            sessionId={sessionId}
            onRequested={refetch}
          />
        )}
      </div>

      {/* 요약 결과 */}
      <div className="min-h-[300px]">
        {summary ? (
          <>
            {/* 완료 */}
            {summary.status === SummaryStatus.COMPLETED && (
              <div className="border border-accent/10 rounded-2xl p-6 bg-accent-soft shadow-sm">
                <p className="whitespace-pre-wrap text-sm leading-relaxed font-medium">
                  {summary.summaryText}
                </p>
              </div>
            )}

            {/*  진행 중 */}
            {summary.status === SummaryStatus.REQUESTED && (
              <div className="flex flex-col items-center justify-center py-16 bg-accent-soft rounded-2xl border border-accent/10">
                <Loader2 className="animate-spin text-accent mb-4" size={32} />
                <p className="font-medium text-accent">
                  AI가 요약 중입니다…
                </p>
              </div>
            )}

            {/*  실패 */}
            {summary.status === SummaryStatus.FAILED && (
              <div className="p-8 text-center bg-red-50 dark:bg-red-900/10 border border-red-200 rounded-2xl">
                <AlertCircle size={32} className="mx-auto text-red-500 mb-2" />
                <p className="text-red-600 font-medium mb-4">
                  요약 생성 실패
                </p>
                <SummaryRequestButton
                  type={type}
                  targetId={targetId}
                  sessionId={sessionId}
                  onRequested={refetch}
                  size="sm"
                />
              </div>
            )}

            {/* 메타 정보 */}
            {summary.modelVersion && (
              <div className="mt-4 p-4 rounded-xl bg-surface-light dark:bg-surface-input border border-dashed text-xs text-text-muted-light dark:text-text-muted-dark">
                Version {summary.versionNo} · {summary.modelVersion}
              </div>
            )}
          </>
        ) : (
          /* 아직 요약 자체가 없음 */
          <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed rounded-3xl">
            <Sparkles size={48} className="text-accent opacity-20 mb-4" />
            <p className="text-sm text-text-muted-light dark:text-text-muted-dark text-center mb-4">
              AI가 내용을 요약해드립니다
            </p>
            <SummaryRequestButton
              type={type}
              targetId={targetId}
              sessionId={sessionId}
              onRequested={refetch}
            />
          </div>
        )}
      </div>
    </div>
  );
}
