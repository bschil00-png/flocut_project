import { api } from "@/lib/axios";

export type MemberUpdateRequest = {
    name?: string;
    tel?: string;
    profileImage?: string;
};

// 내 정보 수정
export function updateMyProfile(data: MemberUpdateRequest): Promise<void> {
    return api.patch("/api/members/me", data);
}

// 회원 탈퇴
export function deleteMyAccount(): Promise<void> {
    return api.delete("/api/members/me");
}
