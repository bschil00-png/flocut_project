// ============================================
// 녹음 상태
// ============================================
export type RecordingState =
  | "idle"
  | "recording"
  | "processing"
  | "completed"
  | "error";

// ============================================
// 음성 조각 타입
// ============================================
export interface RecordChunk {
  recordId: number;
  sessionId: number;
  noteId?: number;
  content: string; // STT 변환된 텍스트
  createdAt: string;
}

// ============================================
// 페이지네이션 응답
// ============================================
export interface RecordPage {
  content: RecordChunk[];
  totalElements: number;
  totalPages: number;
  pageNumber: number;
  pageSize: number;
  hasNext: boolean;
  hasPrevious: boolean;
  isFirst: boolean;
  isLast: boolean;
}

// ============================================
// GraphQL 쿼리 응답 타입
// ============================================
export interface RecordsBySessionQueryResult {
  recordsBySession: RecordPage;
}

// ============================================
// Whisper STT 옵션
// ============================================
export interface WhisperOptions {
  language?: "ko" | "en" | "auto";
  model?: "tiny" | "base" | "small" | "medium" | "large";
  temperature?: number;
}

// ============================================
// 녹음 결과
// ============================================
export interface RecordingResult {
  audioBlob: Blob;
  transcript: string;
  duration: number;
}