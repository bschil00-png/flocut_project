"use client";

import { useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuthActions } from "@/hooks/useAuthActions";

export default function GoogleCallbackClient() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { ensureAuth } = useAuthActions();

    // StrictMode / rerender 중복 실행 방지
    const calledRef = useRef(false);

    useEffect(() => {
        if (calledRef.current) return;
        calledRef.current = true;

        (async () => {
            try {
                const code = searchParams.get("code");
                if (!code) {
                    router.replace("/login");
                    return;
                }

                const response = await fetch("/api/proxy/auth/google/login", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ code }),
                    credentials: "include",
                });


                if (!response.ok) {
                    router.replace("/login");
                    return;
                }

                // 쿠키 반영 대기 (짧게)
                await new Promise(resolve => setTimeout(resolve, 100));

                const ok = await ensureAuth();
                if (!ok) {
                    router.replace("/login");
                    return;
                }

                sessionStorage.removeItem("auth_block_silent_login");
                router.replace("/");
            } catch {
                router.replace("/login");
            }
        })();
    }, [searchParams, ensureAuth, router]);

    return null;
}
