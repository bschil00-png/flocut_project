
//  회원 상태 
export type MemberStatus =
    | "READY"
    | "ACTIVE"
    | "DISABLED"
    | "DELETED";

//  me 쿼리 응답 (인증/헤더/권한)
export interface Me {
    memberId: number;
    email: string;
    name: string;
    profileImage?: string | null;
    status: MemberStatus;
    regdate: string; // ISO string
}

//  로그인 히스토리
export interface LoginHistoryItem {
    loginHistoryId: number;
    ip: string;
    device: string;
    loginDate: string; // ISO string
}

//  마이페이지 - 문서 아이템
export interface MyPageDocumentItem {
    fileId: number;
    fileName: string;
    uploadDate: string; // YYYY-MM-DD or ISO
}

//  마이페이지 - 음성 아이템
export interface MyPageAudioItem {
    fileId: number;
    durationSec: number;
}


 ////  마이페이지 - 비교 아이템

export interface MyPageCompareItem {
    compareRequestId: number;
    regdate: string; // ISO string
}


  // 마이페이지 - 세션 아이템
export interface MyPageSessionItem {
    sessionId: number;
    sessionTitle: string;
}


  // 마이페이지 전체 응답
export interface MyPageOverview {
    documents: MyPageDocumentItem[];
    audios: MyPageAudioItem[];
    compares: MyPageCompareItem[];
    sessions: MyPageSessionItem[];
    totalDocumentCount: number;
    totalAudioCount: number;
    totalCompareCount: number;
}
