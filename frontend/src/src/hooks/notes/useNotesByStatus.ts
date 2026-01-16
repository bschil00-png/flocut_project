import {NotesByStatusResponse, NoteStatus} from "@/lib/graphql/note/note.type";
import {useQuery} from "@apollo/client/react";
import {NOTES_BY_STATUS_QUERY} from "@/lib/graphql/note/note.query";
  export function useNotesByStatus(
    sessionId: number,
    status: NoteStatus,
    page: number = 0,
    size: number = 20
  ) {
    const { data, loading, error, refetch } =
      useQuery<NotesByStatusResponse>(NOTES_BY_STATUS_QUERY, {
        variables: {
          sessionId,
          status,
          page: { page, size },
        },
        skip: !sessionId,
        fetchPolicy: "network-only",
        errorPolicy: "all",
      });

    return {
      page: data?.notesByStatus,
      notes: data?.notesByStatus.content ?? [],
      loading,
      error: error?.message ?? null,
      refetch,
    };
  }
