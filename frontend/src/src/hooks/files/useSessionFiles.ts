import { SESSION_FILES_QUERY } from "@/lib/graphql/file/file.query";
import { SessionFilesQueryResult } from "@/lib/graphql/file/file.type";
import { useQuery } from "@apollo/client/react";

//  서버 페이지 네이션 용
export function useSessionFiles(sessionId: number, page: number = 0, size: number = 20) {
    const { data, loading, error, refetch } = useQuery<SessionFilesQueryResult>(
        SESSION_FILES_QUERY,
        {
            variables: {
                sessionId,
                page: { page, size }
            },
            skip: !sessionId,
            fetchPolicy: "network-only"
        }
    );

    return {
        // 배열이 아닌 Page 객체 전체를 반환하거나 content를 안전하게 추출
        filePage: data?.sessionFiles,
        files: data?.sessionFiles.content || [],
        loading,
        error,
        refetch,
    };
}