"use client";

import { useQuery } from "@apollo/client/react";
import { SESSION_FILES_QUERY } from "@/lib/graphql/file/file.query";
import { SessionFilesQueryResult } from "@/lib/graphql/file/file.type";

const MAX_FILES = 1000;

export function useSessionFilesAll(sessionId: number) {
    const { data, loading, error, refetch } =
        useQuery<SessionFilesQueryResult>(SESSION_FILES_QUERY, {
            variables: {
                sessionId,
                page: {
                    page: 0,
                    size: MAX_FILES,
                },
            },
            skip: !sessionId,
            fetchPolicy: "network-only",
        });

    const files = data?.sessionFiles.content ?? [];
    const filePage = data?.sessionFiles;

    //  디버깅용 로그
    console.log("[useSessionFilesAll]");
    console.log("sessionId:", sessionId);
    console.log("files length:", files.length);
    console.log("fileIds:", files.map(f => f.fileId));

    return {
        files,        // 전체 파일
        filePage,     // totalElements 등 메타 (나중에 서버 페이징용)
        loading,
        error,
        refetch,
    };
}
