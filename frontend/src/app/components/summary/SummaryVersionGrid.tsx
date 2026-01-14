"use client";

import { ChevronLeft, ChevronRight, Trash2, XCircle } from "lucide-react";
import { toast } from "sonner";

import { SummaryStatusBadge } from "./SummaryStatusBadge";
import { deleteSummary } from "@/lib/rest/summary/summary.rest";
import { SummaryStatus } from "@/lib/graphql/summary/summary.type";
import ConfirmDialog from "@/app/components/ui/modal/ConfirmDialog";
import { useState } from "react";

type VersionItem = {
    summaryId: number;
    versionNo: number;
    status: SummaryStatus;
    createdAt: string;
};

type Props = {
    items: VersionItem[];
    selectedId: number | null;
    page: number;
    totalPages: number;
    onSelect: (id: number) => void;
    onPageChange: (page: number) => void;
    onRefetch: () => void;
};

export default function SummaryVersionGrid({
                                               items,
                                               selectedId,
                                               page,
                                               totalPages,
                                               onSelect,
                                               onPageChange,
                                               onRefetch,
                                           }: Props) {
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [targetSummaryId, setTargetSummaryId] = useState<number | null>(null);

    const handleDeleteClick = (summaryId: number, e: React.MouseEvent) => {
        e.stopPropagation();
        setTargetSummaryId(summaryId);
        setShowDeleteConfirm(true);
    };

    const handleConfirmDelete = async () => {
        if (!targetSummaryId) return;

        try {
            await deleteSummary(targetSummaryId);
            toast.success("요약이 삭제되었습니다.");
            onRefetch();
        } catch {
            toast.error("삭제 실패");
        } finally {
            setShowDeleteConfirm(false);
            setTargetSummaryId(null);
        }
    };

    const handleCancelClick = async (summaryId: number, e: React.MouseEvent) => {
        e.stopPropagation();

        if (!window.confirm("요약 생성 요청을 취소하시겠습니까?")) return;

        try {
            await deleteSummary(summaryId);
            toast.success("요약 요청이 취소되었습니다.");
            onRefetch();
        } catch {
            toast.error("취소 실패");
        }
    };

    return (
        <>
            <div className="flex items-start gap-2 px-4 py-3 border-b border-border-light dark:border-border-dark bg-white dark:bg-surface-dark">
                {/* 이전 페이지 */}
                <button
                    onClick={() => onPageChange(Math.max(page - 1, 0))}
                    disabled={page === 0}
                    className="p-2 rounded-lg hover:bg-surface-light dark:hover:bg-surface-dark disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    aria-label="이전 페이지"
                >
                    <ChevronLeft size={18} />
                </button>

                {/* 그리드 */}
                <div className="grid flex-1 gap-2 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                    {items.map((item) => {
                        const selected = item.summaryId === selectedId;
                        const isRequested = item.status === "REQUESTED";

                        return (
                            <div
                                key={item.summaryId}
                                onClick={() => onSelect(item.summaryId)}
                                className={`
                  relative p-3 rounded-xl border cursor-pointer
                  transition-all duration-200
                  ${
                                    selected
                                        ? "border-accent bg-accent-soft shadow-sm"
                                        : "border-border-light dark:border-border-dark hover:border-accent/40 hover:shadow-sm"
                                }
                `}
                            >
                                {/* 상단 */}
                                <div className="flex items-center justify-between gap-2 mb-2">
                  <span
                      className={`text-sm font-bold ${
                          selected ? "text-accent" : ""
                      }`}
                  >
                    v{item.versionNo}
                  </span>
                                    <SummaryStatusBadge status={item.status} />
                                </div>

                                {/* 하단 */}
                                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs text-text-muted-light dark:text-text-muted-dark truncate">
                    {new Date(item.createdAt).toLocaleDateString("ko-KR", {
                        month: "short",
                        day: "numeric",
                    })}
                  </span>

                                    <button
                                        onClick={(e) =>
                                            isRequested
                                                ? handleCancelClick(item.summaryId, e)
                                                : handleDeleteClick(item.summaryId, e)
                                        }
                                        className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                                        aria-label={isRequested ? "요청 취소" : "삭제"}
                                    >
                                        {isRequested ? <XCircle size={14} /> : <Trash2 size={14} />}
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* 다음 페이지 */}
                <button
                    onClick={() => onPageChange(Math.min(page + 1, totalPages - 1))}
                    disabled={page >= totalPages - 1}
                    className="p-2 rounded-lg hover:bg-surface-light dark:hover:bg-surface-dark disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    aria-label="다음 페이지"
                >
                    <ChevronRight size={18} />
                </button>
            </div>

            {/* 삭제 확인 다이얼로그 */}
            <ConfirmDialog
                open={showDeleteConfirm}
                title="요약 삭제"
                message="이 요약을 삭제하시겠습니까?"
                confirmText="삭제"
                cancelText="취소"
                onConfirm={handleConfirmDelete}
                onClose={() => {
                    setShowDeleteConfirm(false);
                    setTargetSummaryId(null);
                }}
            />
        </>
    );
}