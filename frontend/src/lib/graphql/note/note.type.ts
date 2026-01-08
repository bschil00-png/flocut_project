// 노트 상태
export type NoteStatus =
    | "ACTIVE"      // 정상 사용
    | "ARCHIVED"    // 보관
    | "DELETED"     // 휴지통(soft delete)
    | "READY";      // 백엔드에 존재 (필요 없으면 UI 레벨에서 숨김)


// 노트 생성 출처
// 어떤 AI 결과를 기반으로 만들어졌는지 구분
export type NoteSourceType =
    | "MANUAL"
    | "DOCUMENT"
    | "AUDIO"
    | "COMPARE"
    | "COACHING";


// 노트 목록 아이템
// 세션 상세 화면에서 노트 리스트를 그릴 때 사용
export interface NoteListItem {
    noteId: number;
    sessionId: number;

    title: string | null;

    sourceType: NoteSourceType;
    sourceId: number | null;

    status: NoteStatus;

    regdate: string; // ISO
    moddate: string; // ISO
}

// notesByStatus Query 전체 응답
export interface NotesByStatusResponse {
    notesByStatus: NoteListItem[];
}


// 노트 수정 입력값
// Redis + DB 병합 결과
export interface NoteDetailResponse {
    noteId: number;
    sessionId: number;

    title: string | null;
    content: string | null;

    sourceType: NoteSourceType;
    sourceId: number | null;

    status: NoteStatus;

    regdate: string;
    moddate: string;
}

// 노트 생성 입력값
// 요약 버튼 클릭 시 사용
export interface NoteCreateInput {
    sessionId: number;       // 소속 세션
    title: string;           // 초기 제목
    content: string;         // 초기 본문 (AI 요약 결과)
    sourceType?: NoteSourceType;
    sourceId?: number;
}




