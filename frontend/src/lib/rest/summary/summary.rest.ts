import {api} from "@/lib/axios";
import {CheckSummaryResponse, SummaryStatus} from "@/lib/graphql/summary/summary.type";

// 문서 요약 요청 api (ai 요청만 이후 과정은 서버에서)
export async function requestDocumentSummary(
  params: {
    fileId: number;
    sessionId: number;
  }
): Promise<number> {
  return api.post<number>(
    "/api/documents/summaries/request",
    params
  );
}

// 노트 요약 요청
export async function requestNoteSummary(noteId: number): Promise<number> {
  return api.post<number>(`/api/notes/${noteId}/summary`);
}

//요약본 삭제
export async function deleteSummary(summaryId: number): Promise<void> {
    return api.delete(`/api/documents/summaries/${summaryId}`);
}

// 노트 요약 존재 여부 확인
export async function checkNoteSummary(
    noteId: number
): Promise<CheckSummaryResponse> {
    return api.get(`/api/notes/${noteId}/summary/check`);
}


//  노트 요약 히스토리 응답 타입
export type NoteSummaryHistoryResponse = {
    content: Array<{
        summaryId: number;
        versionNo: number;
        status: SummaryStatus;
        createdAt: string;
    }>;
    totalElements: number;
    totalPages: number;
    pageNumber: number;
    pageSize: number;
    hasNext: boolean;
    hasPrevious: boolean;
    isFirst: boolean;
    isLast: boolean;
};

//  노트 요약 히스토리 조회 (REST)
export async function getNoteSummaryHistory(
    noteId: number,
    pageNumber: number = 0,
    pageSize: number = 10
): Promise<NoteSummaryHistoryResponse> {
    return api.get(`/api/notes/${noteId}/summaries`, {
        params: { pageNumber, pageSize },
    });
}