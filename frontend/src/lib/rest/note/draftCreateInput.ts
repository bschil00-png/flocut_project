import {NoteDraft} from "@/lib/rest/note/note.draft";
import {NoteCreateInput} from "@/lib/graphql/note/note.type";

// 드래프트 노트 변환
// 기본 노트 편집에서는 드래프트 사용하지 않는 이유 -> 레디스 쪽에서
export function draftToCreateInput(
  draft: NoteDraft
): NoteCreateInput {
  return {
    sessionId: draft.sessionId,
    title: draft.title,
    content: draft.content,
    sourceType: draft.sourceType,
    sourceId: draft.sourceId,
  };
}