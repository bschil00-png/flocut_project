"use client";

import Link from "next/link";
import { useAuthActions } from "@/hooks/useAuthActions";
import { useAuthState } from "@/hooks/useAuthState";

export default function HeaderClient() {
    const { isAuthenticated, user, initialized } = useAuthState();
    const { logout } = useAuthActions();

    if (!initialized) {
        return (
            <div className="flex items-center gap-3">
                <div className="h-9 w-20 bg-surface-light dark:bg-surface-dark rounded-lg animate-pulse" />
                <div className="h-9 w-20 bg-surface-light dark:bg-surface-dark rounded-lg animate-pulse" />
            </div>
        );
    }

    return (
        <div className="flex items-center gap-3">
            {isAuthenticated ? (
                <>
                    {user?.name && (
                        <div className="px-3 py-1.5 rounded-lg bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark">
                            <span className="text-sm font-medium text-text-primary-light dark:text-text-primary-dark">
                                {user.name}
                            </span>
                        </div>
                    )}

                    <button
                        onClick={logout}
                        className="px-4 py-2 rounded-lg text-sm font-medium text-text-muted-light dark:text-text-muted-dark hover:text-accent hover:bg-accent/5 transition-all"
                    >
                        로그아웃
                    </button>
                </>
            ) : (
                <>
                    <Link
                        href="/login"
                        className="px-4 py-2 rounded-lg text-sm font-medium text-text-muted-light dark:text-text-muted-dark hover:text-accent hover:bg-accent/5 transition-all"
                    >
                        로그인
                    </Link>

                    <Link
                        href="/signup"
                        className="px-5 py-2 rounded-lg text-sm font-semibold bg-accent hover:bg-accent-hover text-white shadow-lg shadow-accent/25 transition-all"
                    >
                        회원가입
                    </Link>
                </>
            )}
        </div>
    );
}