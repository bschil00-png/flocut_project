// ==============================
// Admin GraphQL Types (최종본)
// 백엔드 스키마 기준
// ==============================

import { PageRequestInput } from "@/lib/graphql/common/pagination.type";
import { MemberStatus, UserRole } from "@/lib/graphql/auth/auth.type";


// ==============================
// 관리자 멤버 (목록용)
// adminMembers.content 에 대응
// ==============================
export interface AdminMember {
    memberId: number;
    email: string;
    name: string;
    status: MemberStatus;
    role: UserRole;
    regdate: string; // ISO string (LocalDateTime)
}


// ==============================
// 관리자 멤버 상세
// adminMember Query 결과에 대응
// ==============================
export interface AdminMemberDetail {
    memberId: number;
    email: string;
    name: string;
    tel?: string;            // nullable
    status: MemberStatus;
    role: UserRole;
    emailVerified: boolean;
    regdate: string;         // ISO string
}


// ==============================
// 관리자 로그인 이력 단건
// AdminLoginHistory 타입
// ==============================
export interface AdminLoginHistory {
    loginAt: string;         // ISO-8601 datetime string
    ip: string | null;       // Google 로그인 등에서 null 가능
    device: string;          // GOOGLE_LOGIN, LOCAL, NODE 등
}


// ==============================
// 공용 PageResponse 타입
// PageResponseDTO<T> 대응
// ==============================
export interface PageResponse<T> {
    content: T[];
    totalElements: number;
    totalPages: number;
    pageNumber: number;
    pageSize: number;
    hasNext: boolean;
    hasPrevious: boolean;
    isFirst: boolean;
    isLast: boolean;
}


// ==============================
// 관리자 멤버 페이지
// ==============================
export type AdminMemberPage = PageResponse<AdminMember>;


// ==============================
// 관리자 로그인 이력 페이지
// ==============================
export type AdminLoginHistoryPage = PageResponse<AdminLoginHistory>;


// ==============================
// Query Result / Variables
// ==============================

// 관리자 멤버 목록 조회 결과
export interface AdminMembersQueryResult {
    adminMembers: AdminMemberPage;
}

// 관리자 멤버 목록 조회 변수
export interface AdminMembersQueryVariables {
    page: PageRequestInput;
}


// 관리자 멤버 상세 조회 결과
export interface AdminMemberDetailQueryResult {
    adminMember: AdminMemberDetail;
}

// 관리자 멤버 상세 조회 변수
export interface AdminMemberDetailQueryVariables {
    memberId: number;
}


// 관리자 로그인 이력 조회 결과 (페이지네이션)
export interface AdminLoginHistoryQueryResult {
    adminLoginHistories: AdminLoginHistoryPage;
}

// 관리자 로그인 이력 조회 변수
export interface AdminLoginHistoryQueryVariables {
    memberId: number;
    page: PageRequestInput;
}
