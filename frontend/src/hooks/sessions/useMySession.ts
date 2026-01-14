"use client";

import { useQuery } from "@apollo/client/react";
import { MY_SESSIONS_QUERY } from "@/lib/graphql/session/session.query";
import { MySessionsQueryResponse } from "@/lib/graphql/session/session.type";

export function useMySessions() {
    const { data, loading, error, refetch } =
        useQuery<MySessionsQueryResponse>(MY_SESSIONS_QUERY, {
            fetchPolicy: "cache-and-network",
        });

    return {
        sessions: data?.mySessions ?? [],
        loading,
        error,
        refetch,
    };
}
