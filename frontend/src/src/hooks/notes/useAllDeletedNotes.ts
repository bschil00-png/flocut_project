"use client";

import { useQuery } from "@apollo/client/react";
import { ALL_DELETED_NOTES_QUERY } from "@/lib/graphql/note/note.query";
import { AllDeletedNotesResponse } from "@/lib/graphql/note/note.type";

export function useAllDeletedNotes(page: number = 0, size: number = 20) {
    const { data, loading, error, refetch } = useQuery<AllDeletedNotesResponse>(
        ALL_DELETED_NOTES_QUERY,
        {
            variables: {
                page: { page, size },
            },
            fetchPolicy: "network-only",
            errorPolicy: "all",
        }
    );

    return {
        page: data?.allDeletedNotes,
        notes: data?.allDeletedNotes.content ?? [],
        loading,
        error: error?.message ?? null,
        refetch,
    };
}