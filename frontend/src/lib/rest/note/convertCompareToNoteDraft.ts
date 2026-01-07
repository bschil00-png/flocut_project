// 비교 결과를 노트 임시 객체로 변환
// 사용자가 저장 여부를 결정하기 전 상태
import {CompareResult} from "@/lib/graphql/compare/compare.type";

export function convertCompareToNoteDraft(
    result: CompareResult,
    sessionId: number
) {
    return {
        title: "비교 결과 요약",
        content: `
[공통 핵심]
${result.coreThemes ?? ""}

[추가된 내용]
${result.addedContent ?? ""}

[제거된 내용]
${result.removedContent ?? ""}

[강조 변화]
${result.shiftedFocus ?? ""}
    `,
        sourceType: "COMPARE" as const,
        sourceId: result.compareRequestId,
        sessionId,
    };
}
