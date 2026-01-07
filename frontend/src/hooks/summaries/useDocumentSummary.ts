import {useQuery} from "@apollo/client/react";
import {DOCUMENT_SUMMARY_QUERY} from "@/lib/graphql/summary/summary.query";

// 문서 요약 상태 조회
// 그래프큐엘 응답 타입
interface DocumentSummaryQueryResult {
  documentSummaryByFileId: {
    summaryId: number;
    fileId: number;
    status: "REQUESTED" | "COMPLETED" | "FAILED";
    summaryText: string | null;
    modelVersion: string | null;
  } | null;
}

export function useDocumentSummary(fileId: number) {
  return useQuery<DocumentSummaryQueryResult>(
    DOCUMENT_SUMMARY_QUERY,
    {
      variables: { fileId },
      skip: !fileId,
      pollInterval: 3000, //  3초마다 상태 확인
    }
  );
}