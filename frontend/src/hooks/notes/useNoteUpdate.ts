"use client";

import { useState, useCallback } from "react";
import { toast } from "sonner";
import { syncNote, updateNote } from "@/lib/rest/note/notes.rest";

export function useNoteUpdate(noteId?: number) {
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [error, setError] = useState<string | null>(null);

  // 자동저장: 타이핑 시 Redis 버퍼에 업데이트
  const autoSave = useCallback(
    async (data: { title?: string; content?: string }) => {
      if (!noteId) return;

      setIsSaving(true);
      setError(null);

      try {
        await updateNote({
          noteId,
          title: data.title || "제목 없음",
          content: data.content || "",
        });
        setLastSaved(new Date());
      } catch (err: any) {
        const message = err.response?.data?.message ?? "자동 저장 실패";
        setError(message);
        console.error("자동 저장 실패:", err);
      } finally {
        setIsSaving(false);
      }
    },
    [noteId]
  );

  /**
   * 수동저장 (Explicit Sync):
   * 1. 현재 화면의 데이터를 Redis에 최종 반영
   * 2. Facade의 sync를 호출하여 Redis -> DB로 데이터 이동 및 캐시 삭제
   */
  const sync = useCallback(async (data: { title: string; content: string }) => {
    if (!noteId) return;

    setIsSaving(true);
    setError(null);

    try {
      // Step 1: 현재 로컬 상태를 Redis에 최종 저장 (데이터 유실 방지)
      await updateNote({
        noteId,
        title: data.title,
        content: data.content,
      });

      // Step 2: 백엔드 Facade의 sync 호출 (Redis -> DB 동기화)
      await syncNote(noteId);

      setLastSaved(new Date());
      toast.success("서버에 영구 저장되었습니다.");
    } catch (err: any) {
      const message = err.response?.data?.message ?? "저장 실패";
      setError(message);
      toast.error(message);
      throw err;
    } finally {
      setIsSaving(false);
    }
  }, [noteId]);

  return { autoSave, sync, isSaving, lastSaved, error };
}