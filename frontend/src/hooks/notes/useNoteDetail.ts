// hooks/notes/useNoteDetail.ts
"use client";

import { useCallback, useEffect, useState } from "react";
import { getNoteDetail } from "@/lib/rest/note/notes.rest";
import { NoteDetailResponse } from "@/lib/graphql/note/note.type";

export function useNoteDetail(noteId?: number) {
    const [note, setNote] = useState<NoteDetailResponse | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchData = useCallback(() => {
        if (!noteId) return;

        setLoading(true);
        setError(null);

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

    return { note, loading, error, refetch: fetchData };
}
