import {api} from "@/lib/axios";
import {DocumentSummaryRequest} from "@/lib/graphql/summary/summary.type";

// 문서 요약 요청 api (ai 요청만 이후 과정은 서버에서)
export async function requestDocumentSummary(
    request: DocumentSummaryRequest
): Promise<number> {
    const data = await api.post<number>(
        "/api/documents/summaries/request",
        request
    );
    return data;
}