// components/layout/HeaderClient.tsx
"use client";

import Link from "next/link";
import { useAuthState } from "@/hooks/useAuthState";
import { useAuthActions } from "@/hooks/useAuthActions";

type HeaderClientProps = {
  mobile?: boolean;
  onAction?: () => void;
};

// 헤더 우측 인증 영역
export default function HeaderClient({
                                       mobile = false,
                                       onAction,
                                     }: HeaderClientProps) {
  const { status, user } = useAuthState();
  const { logout } = useAuthActions();

  // 인증 확인 중에는 자리만 유지 (레이아웃 시프트 방지)
  if (status === "checking") {
    return <div className={mobile ? "h-12" : "w-[120px] h-5"} />;
  }

  const isLoggedIn = status === "authenticated" && !!user;

  // 모바일
  if (mobile) {
    return isLoggedIn ? (
      <div className="flex flex-col items-center gap-3">
        <span className="text-base font-bold text-text-primary-light dark:text-text-primary-dark">
          {user.name}님
        </span>

        <button
          onClick={() => {
            logout();
            onAction?.();
          }}
          className="text-sm text-text-muted-light dark:text-text-muted-dark hover:text-red-500"
        >
          로그아웃
        </button>
      </div>
    ) : (
      <div className="flex flex-col items-center gap-6">
        <Link
          href="/login"
          onClick={onAction}
          className="text-base font-bold text-text-primary-light dark:text-text-primary-dark hover:text-accent"
        >
          로그인
        </Link>

        <Link
          href="/signup"
          onClick={onAction}
          className="text-base font-bold text-accent"
        >
          회원가입
        </Link>
      </div>
    );
  }

  // 데스크톱 (기존 디자인 그대로)
  return isLoggedIn ? (
    <div className="flex items-center justify-end gap-5 whitespace-nowrap">
      <span className="text-sm font-bold text-text-primary-light dark:text-text-primary-dark">
        {user.name}님
      </span>

      <button
        onClick={logout}
        className="text-xs font-medium text-text-muted-light dark:text-text-muted-dark hover:text-red-500 transition-colors"
      >
        로그아웃
      </button>
    </div>
  ) : (
    <div className="flex items-center justify-end gap-6 whitespace-nowrap">
      <Link
        href="/login"
        className="text-sm font-bold text-text-muted-light dark:text-text-muted-dark hover:text-text-primary-light dark:hover:text-text-primary-dark transition-colors"
      >
        로그인
      </Link>

      <Link
        href="/signup"
        className="text-sm font-bold text-accent hover:text-accent-hover transition-colors"
      >
        회원가입
      </Link>
    </div>
  );
}
