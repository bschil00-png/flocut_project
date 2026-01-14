import { api } from "@/lib/axios";

export type MemberUpdateRequest = {
  name?: string;
  tel?: string;
  profileImage?: string;
};

// 관리자: 회원 상태 변경 요청 타입
export type AdminMemberStatusUpdateRequest = {
  status: "READY" | "ACTIVE" | "DISABLED" | "DELETED";
  reason?: string;
};

// 관리자: 회원 권한 변경 요청 타입
export type AdminMemberRoleUpdateRequest = {
  role: "USER" | "ADMIN";
  reason?: string;
};

// 내 정보 수정 (일반 회원)
export function updateMyProfile(data: MemberUpdateRequest): Promise<void> {
  return api.patch("/api/members/me", data);
}

// 회원 탈퇴 (일반 회원)
export function deleteMyAccount(): Promise<void> {
  return api.delete("/api/members/me");
}

// 관리자: 회원 상태 변경
// SecurityConfig: /api/admin/** → ADMIN 권한 필요
export function updateMemberStatus(
  memberId: number,
  data: AdminMemberStatusUpdateRequest
): Promise<void> {
  return api.patch(`/api/admin/members/${memberId}/status`, data);
}

// 관리자: 회원 권한 변경
export function updateMemberRole(
  memberId: number,
  data: AdminMemberRoleUpdateRequest
): Promise<void> {
  return api.patch(`/api/admin/members/${memberId}/role`, data);
}
