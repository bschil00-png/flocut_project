import { useQuery } from "@apollo/client/react";
import { NOTE_DETAIL_QUERY } from "@/lib/graphql/note/note.query";
import { NoteDetailResponse } from "@/lib/graphql/note/note.type";

export function useNoteDetail(noteId?: number) {
  const shouldSkip = !noteId;

  const { data, loading } = useQuery<
    NoteDetailResponse,
    { noteId: number }
  >(NOTE_DETAIL_QUERY, {
    skip: shouldSkip,
    variables: { noteId: noteId as number },
  });

  return {
    note: data?.noteDetail ?? null,
    loading,
  };
}
