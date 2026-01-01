
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

                console.log("Google login response status:", response.status);

                if (!response.ok) {
                    const errorText = await response.text();
                    console.error("Google login failed:", errorText);
                    router.replace("/login");
                    return;
                }

                //  쿠키 설정 대기 (100ms)
                await new Promise(resolve => setTimeout(resolve, 100));

                const ok = await ensureAuth();
                if (!ok) {
                    console.error("ensureAuth failed after Google login");
                    router.replace("/login");
                    return;
                }

                sessionStorage.removeItem("auth_block_silent_login");
                router.replace("/");

            } catch (error) {
                console.error("Google login error:", error);
                router.replace("/login");
            }
        })();
    }, [searchParams, ensureAuth, router]);

    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh'
        }}>
            로그인 처리 중...
        </div>
    );
}