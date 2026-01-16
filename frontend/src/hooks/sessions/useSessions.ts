"use client";

import { useState, useEffect } from "react";
import { useQuery } from "@apollo/client/react";
import { SESSIONS_QUERY } from "@/lib/graphql/session/session.query";
import {
    SessionsQueryResponse,
    SessionItem,
} from "@/lib/graphql/session/session.type";

export function useSessions(pageSize = 20) {
    const [page, setPage] = useState(0);
    const [items, setItems] = useState<SessionItem[]>([]);

    const { data, loading, error, refetch } =
        useQuery<SessionsQueryResponse>(SESSIONS_QUERY, {
            variables: {
                page: {
                    page,
                    size: pageSize,
                },
            },
        });

    // 페이지 변경 시 누적
    useEffect(() => {
        if (!data) return;

        setItems((prev) => {
            const existing = new Set(prev.map((s) => s.sessionId));
            const next = data.sessions.content.filter(
                (s) => !existing.has(s.sessionId)
            );
            return [...prev, ...next];
        });
    }, [data]);

    return {
        sessions: items,
        loading,
        error,
        refetch,

        pageInfo: data?.sessions,

        loadMore: () => {
            if (data?.sessions.hasNext) {
                setPage((p) => p + 1);
            }
        },
    };
}
