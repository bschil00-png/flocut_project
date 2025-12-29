"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuthActions } from "@/hooks/useAuthActions";
import { useAuthState } from "@/hooks/useAuthState";

export function AdminGuard({ children }: { children: React.ReactNode }) {
    const { user, loading } = useAuthState();
    const router = useRouter();

    useEffect(() => {
        if (loading) return;

        if (!user) {
            router.replace("/login");
            return;
        }

        if (user.role !== "ADMIN") {
            router.replace("/403");
        }
    }, [loading, user, router]);

    if (loading || !user || user.role !== "ADMIN") {
        return (
            <div className="h-screen flex items-center justify-center">
                권한 확인 중...
            </div>
        );
    }

    return <>{children}</>;
}

