"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthActions } from "@/hooks/useAuthActions";
import { useAuthState } from "@/hooks/useAuthState";

export function AdminGuard({ children }: { children: React.ReactNode }) {
    const { ensureAuth } = useAuthActions();
    const { user, loading } = useAuthState();
    const router = useRouter();

    // 최초 진입 시 인증 동기화
    useEffect(() => {
        ensureAuth();
    }, []);

    // 2 인증 + 권한 판단
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
    }, [loading, user]);

    // 3 로딩 UI
    if (loading || !user) {
        return (
            <div className="h-screen flex items-center justify-center">
                권한 확인 중...
            </div>
        );
    }

    // 4통과
    return <>{children}</>;
}
