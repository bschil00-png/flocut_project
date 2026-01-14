"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { useAuthActions } from "@/hooks/useAuthActions";

export function useAuthRevalidation() {
    const pathname = usePathname();
    const lastCheck = useRef(0);
    const MIN_INTERVAL = 60_000; // 1분

    const { ensureAuth } = useAuthActions();

    const DISABLED_PATHS = [
        "/login",
        "/signup",
        "/member/google/callback",
    ];

    const isDisabled = DISABLED_PATHS.some((p) =>
        pathname.startsWith(p)
    );

    useEffect(() => {
        if (isDisabled) return;

        const checkAuth = async () => {
            if (Date.now() - lastCheck.current < MIN_INTERVAL) return;
            lastCheck.current = Date.now();

            //  여기서 결과만 갱신
            await ensureAuth();
        };

        const handleVisibility = async () => {
            if (document.visibilityState !== "visible") return;
            await checkAuth();
        };

        const handleOnline = async () => {
            await checkAuth();
        };

        document.addEventListener("visibilitychange", handleVisibility);
        window.addEventListener("online", handleOnline);

        return () => {
            document.removeEventListener("visibilitychange", handleVisibility);
            window.removeEventListener("online", handleOnline);
        };
    }, [isDisabled, ensureAuth]);
}
