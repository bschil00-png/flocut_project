// 파일 처리 상태
export type FileStatus =
    | "UPLOADED"
    | "PARSED"
    | "FAILED"
    | "DELETED";

// 파일 업로드 응답 (REST API)
export interface FileUploadResponse {
    fileId: number;
    sessionId: number | null;
    status: FileStatus;
}
// GraphQL sessionFiles 쿼리 응답 타입
export interface SessionFilesQueryResult {
    sessionFiles: FileItem[];
}

// 파일 = 문서
export interface FileItem {
    fileId: number;
    fileName: string;
    fileType: string;
    fileSize: number;
    status: FileStatus;
    regdate: string;
}

// 파일 상세 정보 (조합형)
export interface FileDetail {
    // 기본 정보
    file: FileItem;

    // 텍스트 내용 (txt, docx만)
    text?: string;

    // 미리보기 URL (이미지, pdf)
    previewUrl?: string;

    // 요약 정보
    summary?: {
        summaryId: number;
        summaryText: string;
        status: "REQUESTED" | "COMPLETED" | "FAILED";
        modelVersion?: string;
    };
}