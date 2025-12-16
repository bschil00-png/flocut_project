"use client";

import { useState } from "react";
import Button from "@/app/components/ui/Button";
import { authApi } from "@/app/api/auth/authApi";
import Input from "@/app/components/ui/form/Input";

export default function EmailVerifyForm() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    setLoading(true);
    try {
      await authApi.sendVerifyEmail({ email });
      alert("이메일 인증 메일이 발송되었습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Input
        label="이메일"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <Button loading={loading} onClick={handleSend}>
        이메일 인증하기
      </Button>
    </>
  );
}
