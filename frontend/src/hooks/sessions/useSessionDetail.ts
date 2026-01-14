"use client";

import { useQuery } from "@apollo/client/react";
import { SESSION_DETAIL_QUERY } from "@/lib/graphql/session/session.query";
import { SessionDetailQueryResponse } from "@/lib/graphql/session/session.type";

export function useSessionDetail(sessionId?: number) {
    const { data, loading, error, refetch } =
        useQuery<SessionDetailQueryResponse>(SESSION_DETAIL_QUERY, {
            variables: { sessionId },
            skip: !sessionId,
        });

    return {
        session: data?.session ?? null,
        loading,
        error,
        refetch,
    };
}
