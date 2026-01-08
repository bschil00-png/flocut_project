import {useQuery} from "@apollo/client/react";
import {DOCUMENT_SUMMARY_QUERY} from "@/lib/graphql/summary/summary.query";
import {DocumentSummaryQueryResult} from "@/lib/graphql/summary/summary.type";

// 문서 요약 상태 조회
// 그래프큐엘 응답 타입
export function useDocumentSummary(fileId: number) {
    const { data, loading, error, refetch } = useQuery<DocumentSummaryQueryResult>(
        DOCUMENT_SUMMARY_QUERY,
        {
            variables: { fileId },
            skip: !fileId,
            pollInterval: 3000, // 3초마다 폴링
        }
    );

    return {
        data,
        loading,
        error,
        refetch,
    };
}