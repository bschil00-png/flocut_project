import { AudioSummaryResult } from "@/lib/graphql/audio/audio.type";
import { NoteDraft } from "./note.draft";

export function convertAudioToNoteDraft(
  result: AudioSummaryResult,
  sessionId: number
): NoteDraft {
  return {
    title: "음성 요약",
    content: result.summaryText,
    sourceType: "AUDIO",
    sourceId: result.audioSummaryId,
    sessionId,
  };
}