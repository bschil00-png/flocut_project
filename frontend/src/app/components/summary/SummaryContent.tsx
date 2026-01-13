"use client";

import { useEffect, useMemo, useState } from "react";
import {
    Loader2,
    Sparkles,
    FileText,
    Trash2,
    XCircle,
    ChevronLeft,
    ChevronRight,
} from "lucide-react";
import { toast } from "sonner";

import { SummaryStatus } from "@/lib/graphql/summary/summary.type";
import { useSummaryView } from "@/hooks/summaries/useSummaryView";
import { deleteSummary } from "@/lib/rest/summary/summary.rest";

import { SummaryStatusBadge } from "./SummaryStatusBadge";
import SummaryFormatRenderer from "@/app/components/summary/Summaryformatrenderer";
import SummaryActions from "./SummaryActions";
import SummaryRequestButton from "@/app/components/summary/SummaryRequestButton";

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

const PAGE_SIZE = 6; // 논리적 페이지 크기 (레이아웃과 무관)

export default function SummaryContent({
                                           type,
                                           targetId,
                                           sessionId,
                                           history,
                                           loadingHistory,
                                           onRequestSuccess,
                                           onNoteCreated,
                                       }: Props) {
    const [selectedSummaryId, setSelectedSummaryId] =
        useState<number | null>(null);
    const [page, setPage] = useState(0);

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
        return history.slice(
            page * PAGE_SIZE,
            page * PAGE_SIZE + PAGE_SIZE
        );
    }, [history, page]);

    const refetchAfterDelete = () => {
        setSelectedSummaryId(null);
        onRequestSuccess();
    };

    const handleCancel = async (summaryId: number) => {
        if (!window.confirm("요약 생성 요청을 취소하시겠습니까?")) return;
        try {
            await deleteSummary(summaryId);
            toast.success("요약 생성 요청이 취소되었습니다.");
            refetchAfterDelete();
        } catch {
            toast.error("요약 취소에 실패했습니다.");
        }
    };

    const handleDelete = async (summaryId: number) => {
        if (!window.confirm("요약을 삭제하시겠습니까?")) return;
        try {
            await deleteSummary(summaryId);
            toast.success("요약이 삭제되었습니다.");
            refetchAfterDelete();
        } catch {
            toast.error("요약 삭제에 실패했습니다.");
        }
    };

    if (loadingHistory) {
        return (
            <div className="flex items-center justify-center h-full py-12">
                <Loader2 className="w-10 h-10 animate-spin text-accent" />
            </div>
        );
    }

    if (history.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-full py-12">
                <FileText size={40} className="opacity-20 mb-3" />
                <SummaryRequestButton
                    type={type}
                    targetId={targetId}
                    sessionId={sessionId}
                    onRequested={onRequestSuccess}
                />
            </div>
        );
    }

    const isProcessing =
        selectedHistoryItem?.status === "REQUESTED";

    return (
        <div className="h-full flex flex-col min-w-0">
            {/* 헤더 */}
            <div className="flex items-center justify-between px-3 py-2 border-b">
                <div className="flex items-center gap-2">
                    <Sparkles size={16} />
                    <span className="text-sm font-bold">요약 내역</span>
                </div>
                <SummaryRequestButton
                    type={type}
                    targetId={targetId}
                    sessionId={sessionId}
                    size="sm"
                    onRequested={onRequestSuccess}
                />
            </div>

            {/* 버전 리스트 */}
            <div className="flex items-start gap-2 px-3 py-3 border-b">
                <button
                    onClick={() => setPage((p) => Math.max(p - 1, 0))}
                    disabled={page === 0}
                    className="p-1 disabled:opacity-30"
                >
                    <ChevronLeft size={18} />
                </button>

                <div
                    className="
            grid flex-1 gap-2
            grid-cols-[repeat(auto-fit,minmax(140px,1fr))]
          "
                >
                    {visibleItems.map((item) => {
                        const selected =
                            item.summaryId === selectedSummaryId;
                        const isRequested = item.status === "REQUESTED";

                        return (
                            <div
                                key={item.summaryId}
                                onClick={() =>
                                    setSelectedSummaryId(item.summaryId)
                                }
                                className={`
                  relative p-3 rounded-xl border cursor-pointer
                  ${
                                    selected
                                        ? "border-accent bg-accent-soft"
                                        : "border-border-light hover:border-accent/40"
                                }
                `}
                            >
                                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm font-bold truncate">
                    v{item.versionNo}
                  </span>
                                    <SummaryStatusBadge status={item.status} />
                                </div>

                                <div className="flex items-center justify-between mt-1 gap-2">
                  <span className="text-xs truncate">
                    {new Date(item.createdAt).toLocaleDateString(
                        "ko-KR"
                    )}
                  </span>

                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            isRequested
                                                ? handleCancel(item.summaryId)
                                                : handleDelete(item.summaryId);
                                        }}
                                        className="p-1 text-red-500 hover:bg-red-50 rounded"
                                    >
                                        {isRequested ? (
                                            <XCircle size={14} />
                                        ) : (
                                            <Trash2 size={14} />
                                        )}
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>

                <button
                    onClick={() =>
                        setPage((p) =>
                            Math.min(p + 1, totalPages - 1)
                        )
                    }
                    disabled={page >= totalPages - 1}
                    className="p-1 disabled:opacity-30"
                >
                    <ChevronRight size={18} />
                </button>
            </div>

            {/* 상세 */}
            <div className="flex-1 overflow-y-auto p-4">
                {isProcessing ? (
                    <div className="flex items-center justify-center py-16">
                        <Loader2 className="w-10 h-10 animate-spin" />
                    </div>
                ) : loadingDetail ? (
                    <div className="flex justify-center py-12">
                        <Loader2 className="w-8 h-8 animate-spin" />
                    </div>
                ) : !detail ? (
                    <div className="text-center py-12">
                        요약을 선택하세요
                    </div>
                ) : (
                    <div className="space-y-6">
                        <SummaryActions
                            summaryId={detail.summaryId}
                            sessionId={sessionId}
                            onNoteCreated={onNoteCreated}
                            onDeleted={refetchAfterDelete}
                        />
                        <SummaryFormatRenderer {...detail} />
                    </div>
                )}
            </div>
        </div>
    );
}
