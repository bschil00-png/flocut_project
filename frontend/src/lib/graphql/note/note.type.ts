// 노트 상태
// 노트는 수정 가능하므로 상태 관리가 필요
export type NoteStatus =
    | "ACTIVE"     // 정상 사용 중
    | "ARCHIVED"   // 보관 상태
    | "DELETED";   // 삭제됨 (Soft Delete)


// 노트 생성 출처
// 어떤 AI 결과를 기반으로 만들어졌는지 구분
export type NoteSourceType =
    | "DOCUMENT"
    | "AUDIO"
    | "COMPARE"
    | "MANUAL";


// 노트 목록 아이템
// 세션 상세 화면에서 노트 리스트를 그릴 때 사용
export interface NoteItem {
    noteId: number;          // 노트 PK
    sessionId: number;       // 소속 세션
    title: string;           // 노트 제목
    status: NoteStatus;      // 노트 상태
    createdDate: string;     // 생성일
    modifiedDate: string;    // 마지막 수정일
}


// 노트 상세 조회
// 실제 편집 화면에서 사용하는 타입
export interface NoteDetail {
    noteId: number;          // 노트 PK
    sessionId: number;       // 소속 세션
    memberId: number;        // 작성자
    title: string;           // 제목
    content: string;         // 본문 내용

    sourceType?: NoteSourceType | null; // 생성 출처
    sourceId?: number | null;           // 참조 AI 결과 ID

    status: NoteStatus;      // 상태
    createdDate: string;     // 생성일
    modifiedDate: string;    // 마지막 수정일
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


// 노트 수정 입력값
// 사용자가 직접 편집 후 저장할 때 사용
export interface NoteUpdateInput {
    noteId: number;          // 수정 대상 노트
    title?: string;          // 제목 수정
    content?: string;        // 본문 수정
    status?: NoteStatus;     // 상태 변경
}

// 아직 DB에 저장되지 않은 임시 노트
// compare 결과, 요약 결과 미리보기 용도
// 프론트 상태
export interface NoteDraft {
    title: string;
    content: string;

    sourceType: "COMPARE" | "DOCUMENT" | "AUDIO";
    sourceId: number;

    sessionId: number;
}

// GraphQL Note 타입
// notesBySession 쿼리 응답 그대로 반영
export interface NoteGQL {
  noteId: number;
  title?: string | null;
  regdate?: string | null;
  moddate?: string | null;
  sourceType?: string | null;
  sourceId?: number | null;
}

// notesBySession Query 전체 응답
export interface NotesBySessionResponse {
  notesBySession: NoteGQL[];
}

export interface NoteDetailResponse {
  noteDetail: NoteDetail;
}

