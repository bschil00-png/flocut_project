"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuthActions } from "@/hooks/useAuthActions";

export default function GoogleCallbackPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { sync } = useAuthActions();

    useEffect(() => {
        (async () => {
            try {
                const code = searchParams.get("code");

                if (!code) {
                    router.replace("/login");
                    alert("인증 코드가 없습니다.");
                    return;
                }

                // 백엔드로 code 전송하여 JWT 쿠키 받기
                const response = await fetch("/api/proxy/auth/google/login", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ code }),
                    credentials: "include",
                });

                if (!response.ok) {
                    router.replace("/login");
                    alert("구글 로그인에 실패했습니다.");
                    return;
                }

                // 쿠키가 설정되었으므로 Redux 동기화
                await sync();

                // 메인 페이지로 이동
                router.replace("/");
            } catch (error) {
                console.error("Google login error:", error);
                router.replace("/login");
                alert("구글 로그인 중 오류가 발생했습니다.");
            }
        })();
    }, [searchParams, sync, router]);

    // 로딩 중 아무것도 표시하지 않음
    return null;
}