
//  member, member(인증정보), mypage


export type MemberRole = "USER" | "ADMIN";

export type MemberStatus =
    | "READY"
    | "ACTIVE"
    | "DISABLED"
    | "DELETED";

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