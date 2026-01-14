"use client";

import Link from "next/link";
import { useAuthActions } from "@/hooks/useAuthActions";
import { useAuthState } from "@/hooks/useAuthState";

type HeaderClientProps = {
    mobile?: boolean;
    onAction?: () => void;
};

export default function HeaderClient({
                                         mobile = false,
                                         onAction,
                                     }: HeaderClientProps) {
    const { user, initialized } = useAuthState();
    const { logout } = useAuthActions();

    // 초기 인증 체크 중 → 레이아웃 시프트 방지
    if (!initialized) {
        return <div className={mobile ? "h-12" : "w-[120px] h-5"} />;
    }

    const isLoggedIn = !!user;

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

    // Desktop
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
