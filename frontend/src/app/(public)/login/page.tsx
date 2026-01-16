import { Suspense } from "react";
import LoginClient from "@/app/(public)/login/LoginClient";

export default function LoginPage() {
  return (
    <Suspense fallback={<p>로그인 페이지 로딩 중...</p>}>
      <LoginClient />
    </Suspense>
  );
}
