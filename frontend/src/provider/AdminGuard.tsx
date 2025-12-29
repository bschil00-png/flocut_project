"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuthActions } from "@/hooks/useAuthActions";
import { useAuthState } from "@/hooks/useAuthState";

export function AdminGuard({ children }: { children: React.ReactNode }) {
  const { ensureAuth } = useAuthActions();
  const { user, loading } = useAuthState();
  const router = useRouter();

  // ensureAuth가 한 번만 실행되도록 ref 사용
  const initializedRef = useRef(false);

    useEffect(() => {
        if (initializedRef.current) return;
        initializedRef.current = true;

        ensureAuth();
    }, [ensureAuth]);

    //  인증 결과에 따른 이동
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

  // 아직 인증 확인 중
    if (loading || !user || user.role !== "ADMIN") {
        return (
            <div className="h-screen flex items-center justify-center">
                권한 확인 중...
            </div>
        );
    }

  // 통과
  return <>{children}</>;
}
