// 세션 도메인 공통 타입 정의

//세션 상태
//하나의 워크스페이스가 현재 사용가능한 상태인지, 종료/ 삭제되었는지 판단
export  type SessionStatus =
    | "ACTIVE"    // 정상 상태
    | "ARCHIVED"  // 보관 상태 (읽기 전용)
    | "DELETED"; // soft delete


// 세션 기본 정보 (목록 / 참조용)
// 세션 리스트 , 마이페이지, 사이드바 등에 공통으로 사용
export interface SessionItem {
    sessionId: number;          // 세션 PK
    sessionTitle: string;       // 세션 이름 (ex. 3월 마케팅 회의)
    description?: string | null;// 세션 설명 또는 메모 (선택)
    createdDate: string;        // 생성일 (정렬/표시용)
    status: SessionStatus;      // 세션 상태
}

// 세션 상세 조회

// 세션 상세 화면에서 사용 하는 타입
// 하나의 세션에 묶인 문서/음서/ 비교 정보를
// 한 화면에서 보여주기 위한 구조
export interface SessionDetail {
    sessionId: number;          // 세션 PK
    sessionTitle: string;       // 세션 제목
    description?: string | null;// 세션 설명
    createdDate: string;        // 생성일
    status: SessionStatus;      // 상태
// 이 세션에 포함된 문서 요약 개수
    documentCount: number;
//      이 세션에 포함된 음성 요약 개수
    audioCount: number;

//      회차 정보
//     하나의 세션은 여러 회차를 가질 수 있음
    roundMin?: number | null;   // 최소 회차 번호
    roundMax?: number | null;   // 최대 회차 번호

}

// 세션 목록 조회 응단

// 내 세션 목록 화면에서 사용
//페이징 / 정렬을 고려한 도구
export interface SessionListResponse {
    list: SessionItem[];  // 세션 리스트
    totalCount: number;   // 전체 세션 개수 (페이징용)
}

// 세션 생성 / 수정 입력 타입

// 세션 생성 시 프론트에서 넘기는 데이터
// 테이블 정의서 기준으로 필수/선택 구분
export interface SessionCreateInput {
    sessionTitle: string;        // 세션 이름 (필수)
    description?: string | null; // 세션 설명 (선택)
}

// 세션 수정 시 사용하는 타입
// 제목/설명만 수정 가능하도록 제한
export interface SessionUpdateInput {
    sessionId: number;           // 수정 대상 세션 PK
    sessionTitle?: string;       // 제목 변경 (선택)
    description?: string | null; // 설명 변경 (선택)
}

// 세션 삭제(비활성화) 처리 결과
// 세션 삭제 요청 후 결과 반환용
// 실제로는 Soft Delete 처리됨
export interface SessionDeleteResult {
    deleted: boolean;    // 삭제 성공 여부
    message?: string;    // 안내 메시지
}