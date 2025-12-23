"use client";

import { useAuthActions } from "@/hooks/useAuthActions";
import {
    updateMyProfile,
    deleteMyAccount
} from "@/lib/rest/member/member.rest";

export function useProfileActions() {
    const { sync, logout } = useAuthActions();

    async function updateProfile(payload: {
        name?: string;
        tel?: string;
        profileImage?: string;
    }) {
        // accessToken 만료 시
        // axios interceptor가 refresh 처리
        await updateMyProfile(payload);

        // 서버 기준 상태 재동기화
        await sync();
    }

    async function deleteAccount() {
        // 탈퇴 요청
        await deleteMyAccount();

        // 서버에서 쿠키 삭제 + 상태 초기화
        await logout();
    }

    return {
        updateProfile,
        deleteAccount,
    };
}
