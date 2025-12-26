"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthActions } from "@/hooks/useAuthActions";
import { useAuthState } from "@/hooks/useAuthState";

export function AdminGuard({ children }: { children: React.ReactNode }) {
    const { ensureAuth } = useAuthActions();
    const { user, loading } = useAuthState();
    const router = useRouter();

    // 최초 1회 인증 동기화
    useEffect(() => {
        ensureAuth();
    }, []);

    // 상태 변화 감지 후 라우팅 처리
    useEffect(() => {
        if (loading) return;

        if (!user) {
            router.replace("/login");
            return;
        }

        if (user.role !== "ADMIN") {
            router.replace("/403");
            return;
        }
    }, [loading, user, router]);

    // 로딩 중
    if (loading) {
        return (
            <div className="h-screen flex items-center justify-center">
                권한 확인 중...
            </div>
        );
    }

    // 리다이렉트 대기 중
    if (!user || user.role !== "ADMIN") {
        return null;
    }

    // 통과
    return <>{children}</>;
}
