
 //  노트 상태
export type NoteStatus =
    | "ACTIVE"      // 정상 사용
    | "ARCHIVED"    // 보관
    | "DELETED"     // 휴지통
    | "READY";      // 백엔드에만 존재 (UI에서 숨김 가능)

  // 노트 생성 출처
export type NoteSourceType =
    | "MANUAL"
  | "AI_SUMMARY"
    | "DOCUMENT"
    | "AUDIO"
    | "COMPARE"
    | "COACHING";

 //  노트 목록 아이템 (NoteResponseDTO)
export interface NoteListItem {
    noteId: number;
    sessionId: number;

    title: string | null;

    sourceType: NoteSourceType;
    sourceId: number | null;

    status: NoteStatus;

    regdate: string; // ISO string
    moddate: string; // ISO string
    deletedAt?: string | null;
}

 //  노트 페이지 응답 (NotePage)
export interface NotePage {
    content: NoteListItem[];

    totalElements: number;
    totalPages: number;

    pageNumber: number; // 0-based
    pageSize: number;

    hasNext: boolean;
    hasPrevious: boolean;

    isFirst: boolean;
    isLast: boolean;
}

  // notesByStatus Query 전체 응답

export interface NotesByStatusResponse {
    notesByStatus: NotePage;
}
 // allDeletedNotes Query 응답
 export interface AllDeletedNotesResponse {
     allDeletedNotes: NotePage;
 }

  // 노트 상세 응답 (NoteDetailResponseDTO)

export interface NoteDetailResponse {
    noteId: number;
    sessionId: number;

    title: string | null;
    content: string | null;

    summaryOption?: any; // GraphQL scalar JSON

    sourceType: NoteSourceType;
    sourceId: number | null;

    status: NoteStatus;

    regdate: string;
    moddate: string;
    deletedAt?: string | null;
}


 // 노트 생성 입력값
export interface NoteCreateInput {
    sessionId: number;
    title: string;
    content: string;

    sourceType?: NoteSourceType;
    sourceId?: number;
}
