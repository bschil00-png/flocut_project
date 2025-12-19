"use client";

import { useState } from "react";
import Button from "@/app/components/ui/button/Button";
import Input from "@/app/components/ui/form/Input";
import { sendVerifyEmail } from "@/lib/rest/auth.rest";

export default function EmailVerifyForm() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!email) {
      alert("이메일을 입력해주세요.");
      return;
    }

    setLoading(true);
    try {
      await sendVerifyEmail(email);
      alert("이메일 인증 메일이 발송되었습니다.");
    } catch {
      alert("인증 메일 발송에 실패했습니다.");
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
