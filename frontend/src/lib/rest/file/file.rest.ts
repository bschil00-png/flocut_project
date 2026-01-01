import {FileUploadResponse} from "@/lib/rest/file/file.type";
import {api} from "@/lib/axios";

export async function uploadFile(
  file: File
): Promise<FileUploadResponse> {
  const formData = new FormData();
  formData.append("file", file);

  const data = await api.post<FileUploadResponse>(
    "/api/files/upload",
    formData
  );

  return data;
}