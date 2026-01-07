import {api} from "@/lib/axios";

// 문서 요약 요청 api (ai 요청만 이후 과정은 서버에서)
export async function requestDocumentSummary(params: {
  fileId: number;
  sessionId: number;
  roundNo: number;
}): Promise<number> {
  return api.post<number>(
    "/api/documents/summaries/request",
    params
  );
}