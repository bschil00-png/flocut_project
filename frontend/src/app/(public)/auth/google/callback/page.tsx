// src/app/auth/google/callback/page.tsx
"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuthActions } from "@/hooks/useAuthActions";

export default function GoogleCallbackPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { ensureAuth } = useAuthActions();

    useEffect(() => {
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

                const ok = await ensureAuth();
                if (!ok) {
                    router.replace("/login");
                    return;
                }

                //  여기서 자동 로그인 차단 해제
                sessionStorage.removeItem("auth_block_silent_login");

                router.replace("/");
            } catch (error) {
                console.error("Google login error:", error);
                router.replace("/login");
            }
        })();
    }, [searchParams, ensureAuth, router]);

    return null;
}
