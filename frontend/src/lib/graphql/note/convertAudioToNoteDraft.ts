// 오디오 요약 결과를 노트 임시 객체로 변환
// 사용자가 저장 여부를 결정하기 전 상태
import { AudioSummaryResult } from "@/lib/graphql/audio/audio.type";

export function convertAudioToNoteDraft(
    result: AudioSummaryResult,
    sessionId: number
) {
    return {
        title: "음성 요약",
        content: result.summaryText,
        sourceType: "AUDIO" as const,
        sourceId: result.audioSummaryId,
        sessionId,
    };
}
