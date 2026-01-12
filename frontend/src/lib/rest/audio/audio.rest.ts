import { api } from "@/lib/axios";

// ============================================
// 음성 조각 저장 (텍스트만)
// ============================================
export async function saveRecordChunk(data: {
  sessionId: number;
  noteId?: number;
  content: string;
}): Promise<number> {
  return api.post<number>("/api/records", data);
}

// ============================================
// 음성 조각 수정
// ============================================
export async function updateRecordChunk(
  recordId: number,
  content: string
): Promise<void> {
  return api.put(`/api/records/${recordId}`, { content });
}

// ============================================
// 음성 조각 삭제 (단일)
// ============================================
export async function deleteRecordChunk(recordId: number): Promise<void> {
  return api.delete("/api/records", {
    data: {
      recordId: [recordId] // 백엔드가 배열로 받음
    }
  });
}

// ============================================
// 음성 조각 일괄 삭제
// ============================================
export async function bulkDeleteRecordChunks(recordIds: number[]): Promise<number> {
  const response = await api.delete<{ deletedCount: number }>("/api/records", {
    data: {
      recordId: recordIds
    }
  });
  return response.deletedCount;
}

// ============================================
// 음성 조각 목록 조회 (세션별) - GraphQL 사용
// ============================================
export async function getRecordsBySession(
  sessionId: number,
  page: number = 0,
  size: number = 20
) {
  return api.get(`/api/records/session/${sessionId}`, {
    params: { page, size }
  });
}

// ============================================
// 음성 조각들을 노트에 병합
// ============================================
export async function appendRecordsToNote(
  noteId: number,
  sessionId: number
): Promise<void> {
  return api.patch(`/api/notes/${noteId}/append-records`, null, {
    params: { sessionId }
  });
}

// ============================================
// 🎤 음성 파일 업로드 + STT 변환 (신규)
// ============================================
export async function uploadAndTranscribeAudio(
  audioBlob: Blob,
  sessionId: number,
  noteId?: number,
  language: string = "ko"
): Promise<{ recordId: number; transcript: string }> {
  const formData = new FormData();
  formData.append("audio", audioBlob, "recording.webm");
  formData.append("sessionId", sessionId.toString());
  if (noteId) {
    formData.append("noteId", noteId.toString());
  }
  formData.append("language", language);

  // 백엔드에 STT 엔드포인트 추가 필요: POST /api/records/transcribe
  return api.post<{ recordId: number; transcript: string }>(
    "/api/records/transcribe",
    formData
  );
}