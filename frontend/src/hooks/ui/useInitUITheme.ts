"use client";

import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import { setColorTheme } from "@/store/slice/uislice";
import {
    applyColorTheme,
    getStoredColorTheme,
} from "@/lib/theme/colorTheme";

export default function useInitUITheme() {
    const dispatch = useDispatch();
    const initialized = useRef(false);

    const { isAuthenticated, user } = useSelector(
        (state: RootState) => state.auth
    );

    useEffect(() => {
        if (initialized.current) return;
        initialized.current = true;

        // 로그아웃 상태 → 기본 테마
        if (!isAuthenticated || !user) {
            dispatch(setColorTheme("pink"));
            applyColorTheme("pink");
            return;
        }

        // 로그인 상태 → 유저 기준 복구
        const theme = getStoredColorTheme(user.memberId);
        dispatch(setColorTheme(theme));
        applyColorTheme(theme, user.memberId);
    }, [dispatch, isAuthenticated, user]);
}
