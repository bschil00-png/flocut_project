
//  member, member(인증정보), mypage


export type MemberRole = "USER" | "ADMIN";

export type MemberStatus =
    | "READY"
    | "ACTIVE"
    | "DISABLED"
    | "DELETED";

// 회원 권한
export type UserRole =
    | "USER"
    | "ADMIN";

// GraphQL me 기준 사용자 정보
// authSlice, 마이페이지, 설정 화면 공용 타입
export interface MyProfile {
    memberId: number;
    email: string;
    name: string;
    tel: string;
    role: MemberRole;
    profileImage?: string | null;
    status: MemberStatus;
    regdate: string;
}

// 이메일 찾기 용
export type FindEmailResponse = {
    maskedEmails: string[];
};