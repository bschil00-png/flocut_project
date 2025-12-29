"use client";

import Link from "next/link";
import { useAuthActions } from "@/hooks/useAuthActions";
import { useAuthState } from "@/hooks/useAuthState";

export default function HeaderClient() {
    const { isAuthenticated, user, initialized } = useAuthState();
    const { logout } = useAuthActions();

    // 초기화 전 스켈레톤
    if (!initialized) {
        return (
            <div className="flex items-center gap-4">
                <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
            </div>
        );
    }

    return (
        <div className="flex items-center gap-6">
            {isAuthenticated ? (
                <>
                    {user?.name && (
                        <span className="text-sm text-text-muted-light dark:text-text-muted-dark">
              {user.name}
            </span>
                    )}

                    <button
                        onClick={logout}
                        className="
              text-sm
              text-text-muted-light
              dark:text-text-muted-dark
              hover:text-text-primary-light
              dark:hover:text-text-primary-dark
              transition-colors
            "
                    >
                        로그아웃
                    </button>
                </>
            ) : (
                <>
                    {/* 로그인 */}
                    <Link
                        href="/login"
                        className="
              text-sm
              text-text-muted-light
              dark:text-text-muted-dark
              hover:text-accent
              dark:hover:text-text-primary-dark
              transition-colors
            "
                    >
                        로그인
                    </Link>

                    {/* 회원가입 */}
                    <Link
                        href="/signup"
                        className="
              text-sm font-medium
              text-text-muted-light
              dark:text-text-muted-dark
               dark:hover:text-text-primary-dark
              hover:text-accent
              transition-colors
            "
                    >
                        회원가입
                    </Link>
                </>
            )}
        </div>
    );
}
