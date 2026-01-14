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

// GraphQL 페이징 응답 타입 추가
export interface FilePage {
    content: FileItem[];
    totalElements: number;
    totalPages: number;
    pageNumber: number;
    pageSize: number;
    hasNext: boolean;
    hasPrevious: boolean;
    isFirst: boolean;
    isLast: boolean;
}

// GraphQL sessionFiles 쿼리 응답 타입 수정
export interface SessionFilesQueryResult {
    sessionFiles: FilePage;
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
    file: FileItem;
    text?: string;
    previewUrl?: string;
    summary?: {
        summaryId: number;
        summaryText: string;
        status: "REQUESTED" | "COMPLETED" | "FAILED";
        modelVersion?: string;
    };
}