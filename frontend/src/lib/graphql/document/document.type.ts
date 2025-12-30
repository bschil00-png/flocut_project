
// 파일 처리 상태
export type FileStatus =
  | "UPLOADED"
  | "PARSED"
  | "FAILED"
  | "DELETED";

// 문서 처리 상태 (파일 기준과 동일하게 맞춤)
export type DocumentStatus =
  | "UPLOADED"
  | "PARSED"
  | "FAILED"
  | "DELETED";


export interface FileItem {
  fileId: number;
  fileName: string;
  fileType: string;
  fileSize: number;
  status: FileStatus;
  createdDate: string;
}

// 문서 목록 아이템 (세션 내부 리스트 용)

// 세션 상세 화면에서 문서리스트를 그릴 때 사용하는 최소 단위
//문서 카드, 테이블, 리스트 UI에서 공통으로 사용
export interface DocumentItem {
  fileId: number;
  fileName: string;
  fileType: string;
  filePath: string;
  createdDate: string;

  // 요약 관련
  summaryId?: number | null;
  hasSummary: boolean;

  // 분류 / 검색용
  language?: string | null;
  tags?: string | null;
}

// 문서 상세 조회
//문서 상세 페이지에서 사용하는 타입
// 문서 원문 + 요약 리스트를 함께 다루기 위한 구조
export interface DocumentDetail {
  fileId: number;
  fileName: string;
  fileType: string;
  filePath: string;
  createdDate: string;

  text?: string | null;

  summaries: DocumentSummary[];
  summaryCount: number;
}

// 문서 요약 정보
// 하나의 문서 요약 결과
//회차 + 버전 개념을 포함한다 보면 됨
export interface DocumentSummary {
  summaryId: number;
  fileId: number;
  sessionId: number;

  roundNo: number;
  versionNo: number;
  summaryText: string;

  summaryOption?: string | null;
  topic?: string | null;
  modelVersion?: string | null;

  createdDate: string;
}


//  문서 목록 조회 응답
// 세션 기준 문서 목록 조회 시 사용
// 페이징 및 정렬 대응을 위한 구조
export interface DocumentListResponse {
  documents: DocumentItem[];
  totalCount: number;
}

// 문서 업로드 결과
//  문서 파일 업로드 후 서버에서 반환하는 정보
//  업로드 직후 UI 상태 업데이트 용도
export interface DocumentUploadResult {
  fileId: number;
  fileName: string;
  filePath: string;
  fileType: string;
  createdDate: string;
}

// 문서 요약 요청 결과
// 문서 요약 생성 요청 후 반환되는 결과
// 요약 완료 시 상세 화면에 바로 반영 가능
export interface DocumentSummaryResult {
    summaryId: number;           // 요약 PK
    fileId: number;              // 문서 파일 PK
    sessionId: number;           // 세션 PK
    roundNo: number;             // 회차 번호
    summaryText: string;         // 요약 텍스트
    summaryOption?: string;      // 요약 옵션
    modelVersion?: string;       // LLM 버전
    createdDate: string;        // 생성일 (정렬/표시용)
}