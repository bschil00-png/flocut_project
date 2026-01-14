"use client";

import { useEffect, useMemo, useState } from "react";
import { Loader2 } from "lucide-react";

import { SummaryStatus } from "@/lib/graphql/summary/summary.type";
import { useSummaryView } from "@/hooks/summaries/useSummaryView";

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
    onNoteCreated?: () => void;
};

const PAGE_SIZE = 6;

 //  요약 컨텐츠 공통 컴포넌트
 //  노트: 버전 그리드 숨김, 단일 요약 표시
 //  문서: 버전 그리드 표시, 히스토리 관리
export default function SummaryContent({
                                           type,
                                           targetId,
                                           sessionId,
                                           history,
                                           loadingHistory,
                                           onRequestSuccess,
                                           onNoteCreated,
                                       }: Props) {
    const [selectedSummaryId, setSelectedSummaryId] = useState<number | null>(
        null
    );
    const [page, setPage] = useState(0);

    // 첫 번째 요약 자동 선택
    useEffect(() => {
        if (!selectedSummaryId && history.length > 0) {
            setSelectedSummaryId(history[0].summaryId);
        }
    }, [history, selectedSummaryId]);

    const selectedHistoryItem = history.find(
        (h) => h.summaryId === selectedSummaryId
    );

    const { summary: detail, loading: loadingDetail } = useSummaryView(
        selectedSummaryId ?? undefined
    );

    const totalPages = Math.ceil(history.length / PAGE_SIZE);

    const visibleItems = useMemo(() => {
        return history.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE);
    }, [history, page]);

    const getSummaryContent = () => {
        if (!detail) return "";

        let content = "";

        if (detail.mainTopic) {
            content += `핵심 주제\n${detail.mainTopic}\n\n`;
        }

        if (detail.keyTakeaways && detail.keyTakeaways.length > 0) {
            content += "주요 포인트\n";
            detail.keyTakeaways.forEach((item, idx) => {
                content += `${idx + 1}. ${item}\n`;
            });
            content += "\n";
        }

        if (detail.sections && detail.sections.length > 0) {
            detail.sections.forEach((section) => {
                content += `${section.title}\n${section.content}\n\n`;
            });
        }

        if (
            detail.finalDocument &&
            (!detail.sections || detail.sections.length === 0)
        ) {
            content += detail.finalDocument;
        }

        return content;
    };

    // 로딩 중
    if (loadingHistory) {
        return <SummarySkeleton />;
    }

    // 요약 없음
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

    const isProcessing = selectedHistoryItem?.status === "REQUESTED";

    return (
        <div className="h-full flex flex-col min-w-0">
            {/* 헤더 */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-border-light dark:border-border-dark bg-white dark:bg-surface-dark">
                <h3 className="text-sm font-bold text-text-primary-light dark:text-text-primary-dark">
                    {type === "note" ? "노트 요약" : "요약 내역"}
                </h3>

                <div className="flex items-center gap-2">
                    {detail && !isProcessing && (
                        <DownloadButton
                            title={
                                type === "note"
                                    ? "노트 요약"
                                    : `요약 v${selectedHistoryItem?.versionNo || ""}`
                            }
                            content={getSummaryContent()}
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

            {/* 버전 그리드 (문서만 표시) */}
            {type === "document" && (
                <SummaryVersionGrid
                    items={visibleItems}
                    selectedId={selectedSummaryId}
                    page={page}
                    totalPages={totalPages}
                    onSelect={setSelectedSummaryId}
                    onPageChange={setPage}
                    onRefetch={() => {
                        setSelectedSummaryId(null);
                        onRequestSuccess();
                    }}
                />
            )}

            {/* 본문 */}
            <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                {isProcessing ? (
                    <SummaryProcessing />
                ) : loadingDetail ? (
                    <div className="flex justify-center py-12">
                        <Loader2 className="w-10 h-10 animate-spin text-accent" />
                    </div>
                ) : !detail ? (
                    <div className="text-center py-12 text-text-muted-light dark:text-text-muted-dark">
                        요약을 선택하세요
                    </div>
                ) : (
                    <div className="space-y-6">
                        <SummaryActions
                            summaryId={detail.summaryId}
                            sessionId={sessionId}
                            onNoteCreated={onNoteCreated}
                            onDeleted={() => {
                                setSelectedSummaryId(null);
                                onRequestSuccess();
                            }}
                        />
                        <SummaryFormatRenderer {...detail} />
                    </div>
                )}
            </div>
        </div>
    );
}