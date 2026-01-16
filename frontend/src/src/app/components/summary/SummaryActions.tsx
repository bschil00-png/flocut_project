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
  onNoteCreated?: (noteId: number) => void;
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

      // noteId 전달
      onNoteCreated?.(newNoteId);

      router.push(`/workspace/${sessionId}?type=note&id=${newNoteId}`);
    } catch (e) {
      console.error(e);
      toast.error("노트 생성 실패");
    } finally {
      setLoading(false);
    }
  };

  // const handleDeleteSummary = async () => {
  //   await handleDelete(summaryId, onDeleted);
  // };

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={handleCreateNote}
        disabled={loading}
        className="
          flex-1 inline-flex items-center justify-center gap-2
          px-4 py-2 rounded-lg text-sm font-medium
          bg-accent text-white hover:bg-accent-hover
          disabled:opacity-50
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

      {/*<button*/}
      {/*  onClick={handleDeleteSummary}*/}
      {/*  disabled={loading}*/}
      {/*  className="*/}
      {/*    px-3 py-2 rounded-lg*/}
      {/*    border border-red-200*/}
      {/*    text-red-600*/}
      {/*  "*/}
      {/*>*/}
      {/*  <Trash2 size={16} />*/}
      {/*</button>*/}
    </div>
  );
}
