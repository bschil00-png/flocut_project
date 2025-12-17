"use client";

import { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { authApi } from "@/app/api/auth/authApi";

export default function VerifyEmailPage() {
  const params = useSearchParams();
  const router = useRouter();
  const token = params.get("token");

  useEffect(() => {
    if (!token) return;

    authApi.verifyEmail({ token })
      .then(() => {
        router.replace("/signup");
      })
      .catch(() => {
        alert("인증이 만료되었거나 유효하지 않습니다.");
      });
  }, [token]);

  return <p>이메일 인증 중입니다...</p>;
}
