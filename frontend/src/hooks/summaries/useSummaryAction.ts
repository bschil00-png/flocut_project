"use client";

import { deleteSummary } from "@/lib/rest/summary/summary.rest";
import { toast } from "sonner";

export function useSummaryAction() {
    const handleDelete = async (summaryId: number, callback?: () => void) => {
        const confirmed = window.confirm(
            "요약을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다."
        );

        if (!confirmed) return;

        try {
            await deleteSummary(summaryId);
            toast.success("요약이 삭제되었습니다.");
            callback?.();
        } catch (error) {
            console.error("요약 삭제 실패:", error);
            toast.error("요약 삭제에 실패했습니다.");
        }
    };

    return { handleDelete };
}