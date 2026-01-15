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
    onNoteCreated?: () => void;
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

    const [selectedSummaryId, setSelectedSummaryId] =
        useState<number | null>(null);
    const [page, setPage] = useState(0);

    const initializedRef = useRef(false);

    // 최초 1회 자동 선택
    useEffect(() => {
        if (initializedRef.current) return;
        if (history.length === 0) return;

        setSelectedSummaryId(history[0].summaryId);
        initializedRef.current = true;
    }, [history]);


    const selectedHistoryItem = history.find(
        (h) => h.summaryId === selectedSummaryId
    ) as any;

    const { summary: detail, loading: loadingDetail } = useSummaryView(
        selectedSummaryId ?? undefined
    );

    const hasProcessing = history.some(
        (item) => item.status === SummaryStatus.REQUESTED
    );

    const totalPages = Math.ceil(history.length / PAGE_SIZE);

    const visibleItems = useMemo(() => {
        return history.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE);
    }, [history, page]);

    // 로딩
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
                                    : `요약 v${selectedHistoryItem?.versionNo ?? ""}`
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

            {/* 문서만 그리드 */}
            {type === "document" && !isMobile && (
                <SummaryVersionGrid
                    items={visibleItems}
                    selectedId={selectedSummaryId}
                    page={page}
                    totalPages={totalPages}
                    onSelect={setSelectedSummaryId}
                    onPageChange={setPage}
                    onRefetch={onRequestSuccess}
                />
            )}

            {/* body */}
            <div className="flex-1 min-h-0 overflow-y-auto p-4 custom-scrollbar relative">
                {hasProcessing && !detail ? (
                    <SummaryProcessing />
                ) : loadingDetail ? (
                    <div className="flex justify-center py-12">
                        <Loader2 className="w-10 h-10 animate-spin" />
                    </div>
                ) : !detail ? (
                    <div className="text-center py-12">요약을 선택하세요</div>
                ) : (
                    <div className="space-y-6">
                        {hasProcessing && type === "note" && (
                            <div className="p-3 rounded bg-yellow-50 text-sm">
                                요약을 생성 중입니다. 완료되면 자동으로 갱신됩니다.
                            </div>
                        )}

                        <SummaryActions
                            summaryId={detail.summaryId}
                            sessionId={sessionId}
                            onNoteCreated={onNoteCreated}
                            onDeleted={() => {
                                setSelectedSummaryId(null);
                                initializedRef.current = false;
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
