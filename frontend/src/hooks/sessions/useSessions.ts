"use client";

import { useQuery } from "@apollo/client/react";
import { SESSIONS_QUERY } from "@/lib/graphql/session/session.query";
import {
    SessionsQueryResponse,
} from "@/lib/graphql/session/session.type";

// 로그인한 사용자의 세션(워크스페이스) 목록을 조회하는 훅
// - 조회 전용
// - GlobalNav에서 사용
// - 생성/수정/삭제는 REST로 처리
export function useSessions() {
    const { data, loading, error, refetch } =
        useQuery<SessionsQueryResponse>(SESSIONS_QUERY, {
            // 캐시된 데이터를 먼저 사용하고
            // 백그라운드에서 최신 데이터로 갱신
            fetchPolicy: "cache-and-network",
        });

    return {
        // data가 아직 없을 수 있으므로 기본값 빈 배열 처리
        sessions: data?.sessions ?? [],
        loading,
        error,
        refetch,
    };
}
