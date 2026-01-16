"use client";

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useAuthState } from "@/hooks/useAuthState";
import { setAvatarId } from "@/store/slice/uislice";

 // authSlice.user.profileImage → uiSlice.avatarId 자동 동기화
 // 로그인/새로고침 시 자동 반영
export function useProfileSync() {
    const dispatch = useDispatch();
    const { user } = useAuthState();

    useEffect(() => {
        if (user?.profileImage) {
            dispatch(setAvatarId(user.profileImage));
        }
    }, [user?.profileImage, dispatch]);
}