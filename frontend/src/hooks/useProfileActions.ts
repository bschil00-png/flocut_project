"use client";

import { useAuthActions } from "@/hooks/useAuthActions";
import {
    updateMyProfile,
    deleteMyAccount,
} from "@/lib/rest/member/member.rest";

export function useProfileActions() {
    const { ensureAuth, logout } = useAuthActions();

    async function updateProfile(payload: {
        name?: string;
        tel?: string;
        profileImage?: string;
    }) {
        await updateMyProfile(payload);
        await ensureAuth();
    }

    async function deleteAccount() {
        await deleteMyAccount();
        await logout();
    }

    return {
        updateProfile,
        deleteAccount,
    };
}
