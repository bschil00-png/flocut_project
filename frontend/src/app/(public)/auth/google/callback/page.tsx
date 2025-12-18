"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function GoogleCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    const code = new URLSearchParams(window.location.search).get("code");

    if (!code) {
      router.replace("/login");
      return;
    }

    fetch("http://localhost:8080/auth/google/login", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ code }),
    })
      .then(() => {
        // 로그인 성공 → 메인으로
        router.replace("/");
      })
      .catch(() => {
        router.replace("/login");
      });
  }, [router]);

  return <p>구글 로그인 처리 중...</p>;
}
