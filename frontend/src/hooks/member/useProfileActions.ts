"use client";

import { useAuthActions } from "@/hooks/useAuthActions";
import {
    updateMyProfile,
    deleteMyAccount,
} from "@/lib/rest/member/member.rest";

// 마이페이지 전용 액션
export function useProfileActions() {
    const { ensureAuth, logout } = useAuthActions();

    // 프로필 수정
    // PATCH 후 me 재조회로 member 동기화
    async function updateProfile(payload: {
        name: string;
        tel: string;
        profileImage?: string;
    }) {
        await updateMyProfile(payload);
        await ensureAuth();
    }

    // 회원 탈퇴
    async function deleteAccount() {
        await deleteMyAccount();
        await logout();
    }

    return {
        updateProfile,
        deleteAccount,
    };
}
