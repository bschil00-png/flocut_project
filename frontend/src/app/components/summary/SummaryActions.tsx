// app/components/summary/SummaryActions.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { FileText, Loader2, Trash2 } from "lucide-react";
import { createNoteFromSummary } from "@/lib/rest/note/notes.rest";
import { useSummaryAction } from "@/hooks/summaries/useSummaryAction";

type Props = {
    summaryId: number;
    sessionId: number;
    onNoteCreated?: () => void;
    onDeleted?: () => void;
};

export default function SummaryActions({
                                           summaryId,
                                           sessionId,
                                           onNoteCreated,
                                           onDeleted,
                                       }: Props) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const { handleDelete } = useSummaryAction();

    const handleCreateNote = async (): Promise<void> => {
        setLoading(true);
        try {
            const newNoteId = await createNoteFromSummary({
                summaryId,
                sessionId,
            });

            toast.success("요약으로 노트를 생성했습니다");

            if (onNoteCreated) {
                onNoteCreated();
            }

            router.push(`/workspace/${sessionId}?type=note&id=${newNoteId}`);
        } catch (e) {
            console.error(e);
            toast.error("노트 생성 실패");
        } finally {
            setLoading(false);
        }
    };

    //  요약 삭제 핸들러
    const handleDeleteSummary = async () => {
        await handleDelete(summaryId, onDeleted);
    };

    return (
        <div className="flex items-center gap-2">
            {/* 노트 생성 버튼 */}
            <button
                onClick={handleCreateNote}
                disabled={loading}
                className="
                    flex-1
                    inline-flex items-center justify-center gap-2
                    px-4 py-2 rounded-lg
                    text-sm font-medium
                    bg-accent text-white
                    hover:bg-accent-hover
                    active:scale-[0.98]
                    disabled:opacity-50 disabled:cursor-not-allowed
                    transition-all duration-200
                    shadow-sm hover:shadow-md
                "
            >
                {loading ? (
                    <>
                        <Loader2 size={16} className="animate-spin" />
                        <span>생성 중...</span>
                    </>
                ) : (
                    <>
                        <FileText size={16} />
                        <span>노트 생성</span>
                    </>
                )}
            </button>

            {/* 삭제 버튼 */}
            <button
                onClick={handleDeleteSummary}
                disabled={loading}
                className="
                    px-3 py-2 rounded-lg
                    text-sm font-medium
                    border border-red-200 dark:border-red-800
                    text-red-600 dark:text-red-400
                    hover:bg-red-50 dark:hover:bg-red-900/20
                    active:scale-[0.98]
                    disabled:opacity-50 disabled:cursor-not-allowed
                    transition-all duration-200
                "
                aria-label="요약 삭제"
            >
                <Trash2 size={16} />
            </button>
        </div>
    );
}