"use client";

import {
  DOCUMENT_SUMMARY_QUERY,
} from "@/lib/graphql/summary/summary.query";
import {
  DocumentSummaryQueryResult,
} from "@/lib/graphql/summary/summary.type";
import {useQuery} from "@apollo/client/react";

interface Options {
  enabled?: boolean;
}

export function useDocumentSummary(
  fileId: number,
  options?: Options
) {
  const { data, loading, refetch } =
    useQuery<DocumentSummaryQueryResult>(
      DOCUMENT_SUMMARY_QUERY,
      {
        variables: { fileId },
        skip: options?.enabled === false || !fileId,
        fetchPolicy: "network-only",
      }
    );

  return {
    summary: data?.documentSummaryByFileId ?? null,
    loading,
    refetch,
  };
}
