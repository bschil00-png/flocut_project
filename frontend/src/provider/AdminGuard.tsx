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

  // 아직 인증 확인 중
  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        권한 확인 중...
      </div>
    );
  }

  // 비로그인
  if (!user) {
    router.replace("/login");
    return null;
  }

  // 관리자 아님
  if (user.role !== "ADMIN") {
    router.replace("/403");
    return null;
  }

  // 통과
  return <>{children}</>;
}
