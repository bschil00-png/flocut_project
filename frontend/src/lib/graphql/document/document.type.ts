
//  파일 + 텍스트 + 요약 상태를 가진 객체


// 문서 상태
//업로드 -> 파싱 -> 요약 -> 실패 등의 흐름을 표현
export type DocumentStatus =
    | "UPLOADED"   // 파일 업로드 완료
    | "PARSED"     // 텍스트 추출 완료
    | "FAILED"     // 처리 실패
    | "DELETED";   // Soft Delete


// 문서 목록 아이템 (세션 내부 리스트 용)

// 세션 상세 화면에서 문서리스트를 그릴 때 사용하는 최소 단위
//문서 카드, 테이블, 리스트 UI에서 공통으로 사용
export interface DocumentItem {
    fileId: number;              // 문서 파일 PK
    fileName: string;            // 원본 파일명
    fileType: string;            // pdf / docx / txt 등
    filePath: string;            // S3 파일 접근 URL
    uploadDate: string;          // 업로드 날짜 -> 이거 일단 createdDate로 통일 해보고 나중에 한 번 확인 더 해보고 고려

    // 요약 관련 정보 (없는 경우 null)
    summaryId?: number | null;   // 최신 요약 PK
    hasSummary: boolean;         // 요약 존재 여부

    // 문서 분류 및 검색용
    language?: string | null;    // 문서 언어
    tags?: string | null;        // 태그 목록 (쉼표 구분)

}

// 문서 상세 조회

//문서 상세 페이지에서 사용하는 타입
// 문서 원문 + 요약 리스트를 함께 다루기 위한 구조
export interface DocumentDetail {
    fileId: number;              // 문서 파일 PK
    fileName: string;            // 파일명
    fileType: string;            // 파일 타입
    filePath: string;            // S3 경로
    uploadDate: string;          // 업로드 날짜

    // 문서 전체 텍스트
    // 대용량일 수 있으므로 상세 화면에서만 사용
    text?: string | null;

    // 이 문서에 생성된 요약 목록
    summaries: DocumentSummary[];

    // 요약 개수 (UI 표시 및 조건 분기용)
    summaryCount: number;
}

// 문서 요약 정보
// 하나의 문서 요약 결과
//회차 + 버전 개념을 포함한다 보면 됨
export interface DocumentSummary {
    summaryId: number;           // 요약 PK
    sessionId: number;           // 세션 PK
    roundNo: number;             // 회차 번호
    versionNo: number;           // 요약 버전
    summaryText: string;         // 요약 내용

    // 요약 옵션 및 메타 정보
    summaryOption?: string | null; // 요약 옵션 (짧게/중간/길게)
    topic?: string | null;         // 요약 주제
    modelVersion?: string | null;  // 사용된 LLM 모델

    createdDate: string;        // 생성일 (정렬/표시용)
}

//  문서 목록 조회 응답
// 세션 기준 문서 목록 조회 시 사용
// 페이징 및 정렬 대응을 위한 구조
export interface DocumentListResponse {
    documents: DocumentItem[];   // 문서 리스트
    totalCount: number;          // 전체 문서 개수
}

// 문서 업로드 결과
//  문서 파일 업로드 후 서버에서 반환하는 정보
//  업로드 직후 UI 상태 업데이트 용도
export interface DocumentUploadResult {
    fileId: number;              // 생성된 파일 PK
    fileName: string;            // 원본 파일명
    filePath: string;            // S3 접근 URL
    fileType: string;            // 파일 타입
    createdDate: string;        // 업로드 시간/생성일 (정렬/표시용)
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