"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

// 인증 로직은 컴포넌트에서 직접 처리하지 않는다.
// useAuth 훅이 로그인 → me 조회 → Redux 저장까지 책임진다.
import { useAuth } from "@/hooks/useAuth";

// UI 컴포넌트 (디자인 변경 없음)
import Card from "@/app/components/ui/card/Card";
import Form from "@/app/components/ui/form/Form";
import Input from "@/app/components/ui/form/Input";
import Button from "@/app/components/ui/button/Button";

// 소셜 로그인 핸들러 (window.open 기반)
import { googleLoginHandler } from "@/lib/rest/auth.social";

export default function LoginForm() {
  const router = useRouter();

  // useAuth에서 login 함수만 가져온다
  // Redux dispatch, REST 호출, 쿠키 처리 전부 useAuth 내부에서 수행
  const { login } = useAuth();

  // 입력 상태
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // UI 제어용 상태
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  //   useAuth.login(email, password) 호출
  //     - POST /auth/login (쿠키 발급)
  //     - GET /auth/me (서버 기준 사용자 조회)
  //     - Redux setAuthUser 실행

  // 성공 시 메인 페이지로 이동
  //   실패 시 에러 메시지 표시
  //
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    setLoading(true);
    setError(null);

    try {
      await login(email, password);

      // 로그인 성공 이후 라우팅
      // 이 시점에는 Redux에 사용자 정보가 이미 저장된 상태
      router.replace("/");
    } catch {
      // 인증 실패, 서버 에러 등
      setError("이메일 또는 비밀번호가 올바르지 않습니다.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-[420px]">
      <h1 className="text-2xl font-semibold text-center mb-8">
        로그인
      </h1>

      <Card padding="lg">
        <Form loading={loading} onSubmit={handleSubmit}>
          <Input
            label="이메일"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <Input
            label="비밀번호"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {error && (
            <p className="text-sm text-red-500 text-center">
              {error}
            </p>
          )}

          <Button
            type="submit"
            className="w-full"
            loading={loading}
          >
            로그인
          </Button>

          {/*
                        소셜 로그인
                        - 백엔드 OAuth 엔드포인트로 window.open
                        - 로그인 성공 시 쿠키 발급
                        - 이후 새로고침 또는 me 조회로 Redux 동기화
                    */}
          <Button
            type="button"
            variant="oauth"
            className="w-full"
            onClick={googleLoginHandler}
          >
            Google로 로그인
          </Button>
        </Form>
      </Card>
    </div>
  );
}

