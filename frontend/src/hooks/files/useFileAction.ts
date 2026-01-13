// hooks/files/useFileAction.ts
"use client";

import { deleteFile } from "@/lib/rest/file/file.rest";
import { toast } from "sonner";

export function useFileAction() {
    // confirm 제거 (외부에서 처리)
    const handleDelete = async (fileId: number, callback?: () => void) => {
        try {
            await deleteFile(fileId);
            toast.success("파일이 삭제되었습니다.");
            callback?.();
        } catch (error) {
            console.error("파일 삭제 실패:", error);
            toast.error("파일 삭제에 실패했습니다.");
        }
    };

    // confirm 포함 버전 (개별 삭제용)
    const handleDeleteWithConfirm = async (fileId: number, callback?: () => void) => {
        const confirmed = window.confirm(
            "파일을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다."
        );

        if (!confirmed) return;

        await handleDelete(fileId, callback);
    };

    return { handleDelete, handleDeleteWithConfirm };
}