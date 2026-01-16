"use client";

import {useQuery} from "@apollo/client/react";
import { RECORDS_BY_SESSION_QUERY } from "@/lib/graphql/audio/audio.query";
import { RecordsBySessionQueryResult } from "@/lib/graphql/audio/audio.type";

export function useRecordsBySession(
  sessionId: number,
  page: number = 0,
  size: number = 20
) {
  const { data, loading, error, refetch } = useQuery<RecordsBySessionQueryResult>(
    RECORDS_BY_SESSION_QUERY,
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
    recordPage: data?.recordsBySession,
    records: data?.recordsBySession?.content ?? [],
    loading,
    error: error?.message ?? null,
    refetch,
  };
}