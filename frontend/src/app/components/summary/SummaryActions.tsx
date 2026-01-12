"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {createNoteFromSummary} from "@/lib/rest/note/notes.rest";


type Props = {
  summaryId: number;
  sessionId: number;
};

export default function SummaryActions({
                                         summaryId,
                                         sessionId,
                                       }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // SummaryActions.tsx 수정본
  const handleCreateNote = async (): Promise<void> => {
    setLoading(true);
    try {
      // res는 이미 number (새로운 노트의 ID)입니다.
      const newNoteId = await createNoteFromSummary({
        summaryId,
        sessionId,
      });

      toast.success("요약으로 노트를 생성했습니다.");

      router.push(
        `/workspace/${sessionId}?type=note&id=${newNoteId}`
      );
    } catch (e) {
      console.error(e);
      toast.error("노트 생성 실패");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleCreateNote}
      disabled={loading}
      className="text-sm px-3 py-1.5 rounded border"
    >
      {loading ? "생성 중..." : "이 요약으로 노트 생성"}
    </button>
  );
}