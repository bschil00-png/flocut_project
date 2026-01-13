"use client";

import { useParams } from "next/navigation";
import { useState, useCallback, useMemo, useEffect } from "react";
import { useNotesByStatus } from "@/hooks/notes/useNotesByStatus";
import { useSessionFiles } from "@/hooks/files/useSessionFiles";
import { NoteStatus } from "@/lib/graphql/note/note.type";
import { SortBy } from "@/hooks/workspace/workspace";
import { toast } from "sonner";

const MAX_ITEMS = 1000; // 최대 표시 개수

export function useWorkspaceQuery(sortBy: SortBy = "recent") {
    const { sessionId } = useParams<{ sessionId: string }>();
    const [notePage, setNotePage] = useState(0);

    //  정렬 옵션을 쿼리에 전달 (이후 백엔드 지원 확장 필요)
    // 현재는 클라이언트 정렬이므로 큰 사이즈로 가져옴
    const notesQuery = useNotesByStatus(
        Number(sessionId),
        "ACTIVE" as NoteStatus,
        0, //  항상 첫 페이지
        MAX_ITEMS, //   전체 로드
        // sortBy //  백엔드에서 정렬 지원 시 주석 해제
    );

    const filesQuery = useSessionFiles(Number(sessionId));

    //  전체 개수 확인 및 경고
    const totalNotesInBackend = notesQuery.page?.totalElements ?? 0;

    useEffect(() => {
        if (totalNotesInBackend > MAX_ITEMS) {
            toast.warning(
                `이 세션의 노트가 ${totalNotesInBackend.toLocaleString()}개입니다. 최근 ${MAX_ITEMS.toLocaleString()}개만 표시됩니다.`,
                {
                    duration: 5000,
                    description: "세션을 나누는 것을 권장합니다.",
                }
            );
        }
    }, [totalNotesInBackend]);

    //  클라이언트 페이지네이션
    const totalNotes = notesQuery.notes.length;
    const pageSize = 20;
    const totalPages = Math.ceil(totalNotes / pageSize);

    const pagedNotes = useMemo(() => {
        const start = notePage * pageSize;
        return notesQuery.notes.slice(start, start + pageSize);
    }, [notesQuery.notes, notePage, pageSize]);

    // 강제 refetch 함수
    const forceRefetch = useCallback(async () => {
        console.log("[useWorkspaceQuery] 강제 refetch 실행");
        await Promise.all([
            notesQuery.refetch(),
            filesQuery.refetch(),
        ]);
    }, [notesQuery, filesQuery]);

    return {
        sessionId: Number(sessionId),

        notes: pagedNotes, // 페이징된 노트
        allNotes: notesQuery.notes, // 전체 노트 (정렬용)
        notePageData: {
            pageNumber: notePage,
            totalPages,
            totalElements: totalNotes,
            hasNext: notePage < totalPages - 1,
            hasPrevious: notePage > 0,
            isFirst: notePage === 0,
            isLast: notePage === totalPages - 1,
        },
        setNotePage,

        files: filesQuery.files,

        loading: notesQuery.loading || filesQuery.loading,

        refetchNotes: notesQuery.refetch,
        refetchFiles: filesQuery.refetch,
        forceRefetch,
    };
}