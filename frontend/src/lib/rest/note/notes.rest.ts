import { api } from "@/lib/axios";
import { NoteDetailResponse } from "@/lib/graphql/note/note.type";

// 노트 생성
export const createNote = (payload: {
  sessionId: number;
  title: string;
  content: string;
  sourceType?: string;
  sourceId?: number;
}) => api.post<number>("/api/notes", payload);

// 자동 저장 (타이핑 중 주기적으로 호출)
export const autoSaveNote = (
  noteId: number,
  payload: { title?: string; content?: string }
) => api.patch<void>(`/api/notes/${noteId}/autosave`, payload);

// 명시적 저장 (저장 버튼 클릭시)
export const syncNote = (noteId: number) =>
  api.post<void>(`/api/notes/${noteId}/sync`);

// 노트 상세 조회 (편집 화면에서 사용)
export const getNoteDetail = (noteId: number) =>
  api.get<NoteDetailResponse>(`/api/notes/${noteId}`);

// 삭제 노트 복구
export const restoreNote = (noteId: number) =>
  api.patch<void>(`/api/notes/${noteId}/restore`);

// 영구 삭제
export const hardDeleteNote = (noteId: number) =>
  api.delete<void>(`/api/notes/${noteId}/hard`);

// 휴지통 이동
export const deleteNote = (noteId: number) =>
    api.patch<void>(`/api/notes/${noteId}/trash`);

// 세션 이동
export const moveNote = (noteId: number, targetSessionId: number) =>
  api.patch<void>(`/api/notes/${noteId}/move`, { sessionId: targetSessionId });

// 수정 (자동저장용)
export async function updateNote(data: {
  noteId: number;
  title: string;
  content: string;
}): Promise<void> {
  await api.patch(`/api/notes/${data.noteId}/autosave`, {
    title: data.title,
    content: data.content,
  });
}