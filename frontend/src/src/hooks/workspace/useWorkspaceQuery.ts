"use client";

import { useParams } from "next/navigation";
import { useMemo, useCallback } from "react";
import { useNotesByStatus } from "@/hooks/notes/useNotesByStatus";
import { useSessionFilesAll } from "@/hooks/files/useSessionFilesAll";
import { NoteStatus } from "@/lib/graphql/note/note.type";
import { SortBy, WorkspaceItem } from "@/hooks/workspace/workspace";

const MAX_NOTES = 1000;

export function useWorkspaceQuery(sortBy: SortBy = "recent") {
    const { sessionId } = useParams<{ sessionId: string }>();

    const notesQuery = useNotesByStatus(
        Number(sessionId),
        "ACTIVE" as NoteStatus,
        0,
        MAX_NOTES
    );

    const filesQuery = useSessionFilesAll(Number(sessionId));

    const allNotes: WorkspaceItem[] = useMemo(
        () =>
            notesQuery.notes.map((n) => ({
                id: `note-${n.noteId}`,
                type: "note",
                title: n.title ?? "제목 없음",
                date: n.moddate ?? n.regdate ?? "",
                regdate: n.regdate ?? "",
                moddate: n.moddate ?? "",
                noteId: n.noteId,
            })),
        [notesQuery.notes]
    );

    const allFiles: WorkspaceItem[] = useMemo(
        () =>
            filesQuery.files.map((f) => ({
                id: `document-${f.fileId}`,
                type: "document",
                title: f.fileName,
                date: f.regdate ?? "",
                regdate: f.regdate ?? "",
                moddate: f.regdate ?? "",
                fileId: f.fileId,
                fileName: f.fileName,
            })),
        [filesQuery.files]
    );

    console.log("[useWorkspaceQuery]");
    console.log("notes:", allNotes.length);
    console.log("files:", allFiles.length);

    const forceRefetch = useCallback(async () => {
        console.log("[useWorkspaceQuery] forceRefetch");
        await Promise.all([
            notesQuery.refetch(),
            filesQuery.refetch(),
        ]);
    }, [notesQuery, filesQuery]);

    return {
        sessionId: Number(sessionId),

        allNotes,
        allFiles,

        loading: notesQuery.loading || filesQuery.loading,

        refetchNotes: notesQuery.refetch,
        refetchFiles: filesQuery.refetch,
        forceRefetch,
    };
}
