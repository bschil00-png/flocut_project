
import { SESSION_FILES_QUERY } from "@/lib/graphql/file/file.query";
import { SessionFilesQueryResult } from "@/lib/graphql/file/file.type";
import {useQuery} from "@apollo/client/react";

export function useSessionFiles(sessionId: number) {
    const { data, loading, error, refetch } = useQuery<SessionFilesQueryResult>(
        SESSION_FILES_QUERY,
        {
            variables: { sessionId },
            skip: !sessionId,
        }
    );

    return {
        files: data?.sessionFiles || [],
        loading,
        error,
        refetch,
    };
}