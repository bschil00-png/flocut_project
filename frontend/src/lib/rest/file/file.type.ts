
// 현재 백엔드 응답
export type FileUploadStatus =
  | "UPLOADED"
  | "PARSED"
  | "FAILED"
  | "DELETED";

export interface FileUploadResponse {
  fileId: number;
  status: FileUploadStatus;
}
