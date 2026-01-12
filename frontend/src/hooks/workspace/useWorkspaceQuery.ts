"use client";

import { useParams } from "next/navigation";
import { useState } from "react";
import { useNotesByStatus } from "@/hooks/notes/useNotesByStatus";
import { useSessionFiles } from "@/hooks/files/useSessionFiles";
import { NoteStatus } from "@/lib/graphql/note/note.type";

export function useWorkspaceQuery() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const [notePage, setNotePage] = useState(0);

  const notesQuery = useNotesByStatus(
    Number(sessionId),
    "ACTIVE" as NoteStatus,
    notePage,
    20
  );

  const filesQuery = useSessionFiles(Number(sessionId));

  return {
    sessionId: Number(sessionId),

    notes: notesQuery.notes,
    notePageData: notesQuery.page,
    setNotePage,

    files: filesQuery.files,

    loading: notesQuery.loading || filesQuery.loading,

    refetchNotes: notesQuery.refetch,
    refetchFiles: filesQuery.refetch,
  };
}
