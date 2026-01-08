import { api } from "@/lib/axios";
import { FileUploadResponse } from "@/lib/graphql/file/file.type";

//  파일 업로드 (sessionId optional)
export async function uploadFile(
    file: File,
    sessionId?: number
): Promise<FileUploadResponse> {
    const formData = new FormData();
    formData.append("file", file);

    //  sessionId가 있을 때만 추가
    if (sessionId !== undefined) {
        formData.append("sessionId", sessionId.toString());
    }

    const data = await api.post<FileUploadResponse>(
        "/api/files/upload",
        formData
    );

    return data;
}

// 텍스트 파일 내용 조회
export async function getFileText(fileId: number): Promise<string> {
    return api.get<string>(`/api/files/${fileId}/preview/text`);
}

// 이미지/PDF Presigned URL 조회
export async function getFilePreviewUrl(fileId: number): Promise<string> {
    return api.get<string>(`/api/files/${fileId}/preview`);
}