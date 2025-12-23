// 문서 요약 결과를 노트 임시 객체로 변환
// 사용자가 저장 여부를 결정하기 전 상태
import { DocumentSummaryResult } from "@/lib/graphql/document/document.type";

export function convertDocumentToNoteDraft(
    result: DocumentSummaryResult,
    sessionId: number
) {
    return {
        title: "문서 요약",
        content: result.summaryText,
        sourceType: "DOCUMENT" as const,
        sourceId: result.summaryId,
        sessionId,
    };
}
