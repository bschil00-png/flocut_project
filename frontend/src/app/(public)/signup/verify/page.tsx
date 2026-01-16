import { Suspense } from "react";
import VerifyClient from "./VerifyClient";

export default function VerifyPage() {
  return (
    <Suspense fallback={<p>이메일 인증 중입니다...</p>}>
      <VerifyClient />
    </Suspense>
  );
}
