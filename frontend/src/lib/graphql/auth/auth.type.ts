export type MemberRole = "USER" | "ADMIN";

export type MemberStatus =
    | "READY"
    | "ACTIVE"
    | "DISABLED"
    | "DELETED";

// 인증 컨텍스트 기준 내 정보
export interface MyProfile {
    memberId: number;
    email: string;
    name: string;
    role: MemberRole;
    profileImage?: string | null;
    status: MemberStatus;
    regdate: string;
}
