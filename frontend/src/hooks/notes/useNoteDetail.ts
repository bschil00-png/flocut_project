// hooks/notes/useNoteDetail.ts
import {useCallback, useEffect, useState} from "react";
import { getNoteDetail } from "@/lib/rest/note/notes.rest";
import { NoteDetailResponse } from "@/lib/graphql/note/note.type";

// 노트 상세 조회 훅 (REST API 사용 - Redis + DB 병합)
// 편집 화면에서 자동저장된 최신 데이터 조회용
export function useNoteDetail(noteId?: number) {
  const [note, setNote] = useState<NoteDetailResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 로직을 fetchData 함수로 분리하여 재사용 가능하게 만듦
  const fetchData = useCallback(() => {
    if (!noteId) return;
    setLoading(true);
    getNoteDetail(noteId)
      .then(setNote)
      .catch((err) => {
        console.error("노트 조회 실패:", err);
        setError(err.response?.data?.message ?? "노트를 불러올 수 없습니다");
      })
      .finally(() => setLoading(false));
  }, [noteId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // refetch라는 이름으로 함수를 반환함
  return { note, loading, error, refetch: fetchData };
}