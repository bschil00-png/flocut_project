"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuthActions } from "@/hooks/useAuthActions";
import { motion } from "framer-motion";
import Link from "next/link";

// UI 컴포넌트
import Input from "../ui/input/Input";
import Button from "@/app/components/ui/button/Button";

// 소셜 로그인 핸들러
import { googleLoginHandler } from "@/lib/rest/auth/auth.social";

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuthActions();

  // 입력 상태
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // UI 제어 상태
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 구글 에러
  useEffect(() => {
    const errorParam = searchParams.get("error");

    if (errorParam === "no_code") {
      setError("인증 코드가 없습니다.");
    } else if (errorParam === "google_failed") {
      setError("구글 로그인에 실패했습니다.");
    } else if (errorParam === "unexpected") {
      setError("구글 로그인 중 오류가 발생했습니다.");
    }

    // URL 정리
    if (errorParam) {
      const newUrl = window.location.pathname;
      window.history.replaceState({}, "", newUrl);
    }
  }, [searchParams]);

  // 기본 로그인
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    // 로그인 중에는 member revalidation 중단
    sessionStorage.setItem("auth_in_progress", "1");

    setLoading(true);
    setError(null);

    try {
      await login(email, password);

      // 로그인 성공 → 플래그 제거
      sessionStorage.removeItem("auth_in_progress");

      router.replace("/");
    } catch {
      sessionStorage.removeItem("auth_in_progress");
      setError("이메일 또는 비밀번호가 올바르지 않습니다.");
    } finally {
      setLoading(false);
    }
  }

  // 구글 로그인
  function handleGoogleLogin() {
    // 사용자가 명시적으로 클릭한 로그인 → silent login 허용
    sessionStorage.removeItem("auth_block_silent_login");
    googleLoginHandler();
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="w-full max-w-md"
    >
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">
          로그인
        </h1>
        <p className="text-text-muted-light dark:text-text-muted-dark">
          FloCut에서 문서 분석을 시작하세요
        </p>
      </div>

      {/* Form Card */}
      <div className="p-8 rounded-2xl bg-white dark:bg-surface-dark border border-border-light dark:border-border-dark shadow-xl">
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email Input */}
          <Input
            label="이메일"
            type="email"
            value={email}
            required
            onChange={(e) => setEmail(e.target.value)}
            placeholder="email@example.com"
          />

          {/* Password Input */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-sm text-text-muted-light dark:text-text-muted-dark">
                비밀번호
              </label>
              <Link
                href="/forgot-password"
                className="text-xs text-accent hover:text-accent-hover transition-colors font-medium"
              >
                비밀번호 찾기
              </Link>
            </div>
            <Input
              type="password"
              value={password}
              required
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/30">
              <p className="text-sm text-red-500 text-center">
                {error}
              </p>
            </div>
          )}

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full"
            loading={loading}
          >
            로그인
          </Button>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border-light dark:border-border-dark" />
            </div>
            <div className="relative flex justify-center text-sm">
                            <span className="px-4 bg-white dark:bg-surface-dark text-text-muted-light dark:text-text-muted-dark">
                                또는
                            </span>
            </div>
          </div>

          {/* Google Login */}
          <Button
            type="button"
            variant="oauth"
            className="w-full flex items-center justify-center gap-2"
            onClick={handleGoogleLogin}
          >
            <svg
              className="w-5 h-5"
              viewBox="0 0 24 24"
            >
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            <span>Google로 계속하기</span>
          </Button>

        </form>
      </div>

      {/* Footer Links */}
      <div className="mt-6 space-y-4">
        {/* 회원가입 */}
        <div className="p-4 rounded-xl bg-accent/5 border border-accent/20 text-center">
          <p className="text-sm text-text-muted-light dark:text-text-muted-dark mb-2">
            아직 계정이 없으신가요?
          </p>
          <Link
            href="/signup"
            className="inline-flex items-center justify-center h-10 px-5 rounded-lg bg-accent hover:bg-accent-hover text-white font-semibold text-sm transition-all shadow-lg shadow-accent/25"
          >
            회원가입하기
          </Link>
        </div>

        {/* 추가 링크 */}
        <div className="flex items-center justify-center gap-6 text-sm">
          <Link
            href="/find-email"
            className="text-text-muted-light dark:text-text-muted-dark hover:text-accent transition-colors"
          >
            아이디 찾기
          </Link>
          <span className="text-border-light dark:text-border-dark">|</span>
          <Link
            href="/forgot-password"
            className="text-text-muted-light dark:text-text-muted-dark hover:text-accent transition-colors"
          >
            비밀번호 찾기
          </Link>
        </div>
      </div>
    </motion.div>
  );
}