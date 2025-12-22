"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthActions } from "@/hooks/useAuthActions";

export default function GoogleCallbackPage() {
  const router = useRouter();
  const { sync } = useAuthActions();

  useEffect(() => {
    (async () => {
      try {
        //  쿠키 기반 사용자 동기화
        await sync();

        // 성공 → 메인
        router.replace("/");
      } catch {
        router.replace("/login");
      }
    })();
  }, [sync, router]);

  return <p>구글 로그인 처리 중...</p>;
}
