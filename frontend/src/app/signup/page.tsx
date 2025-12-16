"use client";

import { useState } from "react";
import SignupForm from "@/app/components/auth/SignupForm";

import Button from "@/app/components/ui/Button";
import Card from "@/app/components/ui/form/Card";
import Input from "@/app/components/ui/form/Input";

export default function SignupPage() {
  //  지금은 프론트 상태로만 인증 여부 관리
  const [email, setEmail] = useState("");
  const [emailVerified, setEmailVerified] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleVerifyEmail = async () => {
    setLoading(true);

    //  지금은 실제 API 안 붙임
    // 그냥 "인증 완료" 처리
    setTimeout(() => {
      setEmailVerified(true);
      setLoading(false);
    }, 800);
  };

  // ===== 이메일 인증 전 =====
  return (
    <div
      className="
        min-h-[calc(100vh-64px)]
        bg-background-light dark:bg-background-dark
        flex items-start justify-center
        px-4
        pt-28
      "
    >
      <div className="w-full max-w-[420px]">
        {!emailVerified ? (
          <Card padding="lg">
            <h1 className="text-2xl font-semibold text-center mb-6">
              회원가입
            </h1>

            <Input
              label="이메일"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@email.com"
            />
            <p className="text-xs text-center text-text-muted-light mt-4">
              이메일 인증 후 회원가입을 진행할 수 있습니다.
            </p>

            <Button
              className="w-full mt-4"
              loading={loading}
              onClick={handleVerifyEmail}
            >
              이메일 인증하기
            </Button>
          </Card>
        ) : (
          <SignupForm />
        )}
      </div>
    </div>
  );
}
