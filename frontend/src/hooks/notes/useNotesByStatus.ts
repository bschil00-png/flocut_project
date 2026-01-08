"use client";

import { NOTES_BY_STATUS_QUERY } from "@/lib/graphql/note/note.query";
import {
    NotesByStatusResponse,
    NoteStatus,
} from "@/lib/graphql/note/note.type";
import { useQuery } from "@apollo/client/react";

export function useNotesByStatus(sessionId: number, status: NoteStatus) {
    const { data, loading, error, refetch } = useQuery<NotesByStatusResponse>(
        NOTES_BY_STATUS_QUERY,
        {
            variables: { sessionId, status },
            skip: !sessionId,

            // REST(createNote) + GraphQL(list) 혼합 구조에서는
            // cache-and-network가 오히려 생성 직후 UX를 깨뜨릴 수 있음
            // → 항상 서버 기준으로 가져오도록 network-only 사용
            fetchPolicy: "network-only",

            errorPolicy: "all",
        }
    );

    return {
        notes: data?.notesByStatus ?? [],
        loading,
        error: error?.message ?? null,
        refetch,
    };
}
