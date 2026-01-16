// 비교 대상 타입
// 어떤 요약 결과를 비교하는지 구분
export type CompareTargetType =
    | "DOCUMENT"
    | "AUDIO"
    | "NOTE";


// 비교 대상 하나
// 내부적으로는 요약 결과(summary)를 기준으로 비교
export interface CompareTarget {
    targetType: CompareTargetType; // DOCUMENT / AUDIO / NOTE
    sourceId: number;              // summaryId 또는 noteId
    sessionId: number;             // 세션 기준
}


// 비교 생성 입력값
// 비교 버튼 클릭 시 사용
export interface CompareCreateInput {
    sessionId: number;             // 비교가 속한 세션
    targets: CompareTarget[];      // 비교 대상 목록 (2개 이상)
    modelVersion?: string;         // LLM 모델 (선택)
}


// 비교 결과
// AI가 생성한 비교 분석 결과
export interface CompareResult {
    compareRequestId: number;      // 비교 요청 PK
    sessionId: number;             // 세션 PK

    addedContent?: string | null;  // 새롭게 추가된 내용
    removedContent?: string | null;// 제거된 내용
    shiftedFocus?: string | null;  // 강조 변화
    coreThemes?: string | null;    // 공통 핵심 주제

    modelVersion?: string | null;  // 사용 모델
    createdDate: string;           // 생성 시각
}


// 비교 목록 아이템
// 비교 히스토리 화면에서 사용
export interface CompareItem {
    compareRequestId: number;      // 비교 요청 PK
    sessionId: number;             // 세션 PK
    modelVersion?: string | null;  // 사용 모델
    targetCount: number;           // 비교 대상 개수
    createdDate: string;           // 실행일
}


// 비교 상세 조회 결과
// 이미 실행된 비교를 다시 열어볼 때 사용
export interface CompareDetail extends CompareResult {
    targetCount: number;           // 비교 대상 개수
}
