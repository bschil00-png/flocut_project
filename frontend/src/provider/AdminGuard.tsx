"use client";

import { useAuthState } from "@/hooks/useAuthState";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export function AdminGuard({ children }: { children: React.ReactNode }) {
    const { user, loading } = useAuthState();
    const router = useRouter();

    useEffect(() => {
        if (loading) return;

        if (!user || user.role !== "ADMIN") {
            router.replace("/403");
        }
    }, [user, loading, router]);

    if (loading) {
        return (
            <div className="h-screen flex items-center justify-center">
                <div>권한 확인 중...</div>
            </div>
        );
    }

    if (!user || user.role !== "ADMIN") {
        return (
            <div className="h-screen flex items-center justify-center">
                <div>접근 권한이 없습니다</div>
            </div>
        );
    }

    return <>{children}</>;
}
