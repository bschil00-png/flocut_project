"use client";

import Link from "next/link";
import { useAuthActions } from "@/hooks/useAuthActions";
import { useAuthState } from "@/hooks/useAuthState";

type HeaderClientProps = {
    mobile?: boolean;
};

export default function HeaderClient({ mobile = false }: HeaderClientProps) {
    const { isAuthenticated, user, initialized } = useAuthState();
    const { logout } = useAuthActions();

    if (!initialized) return null;

    if (mobile) {
        return isAuthenticated ? (
            <div className="flex flex-col gap-2">
                <span className="text-sm font-medium">{user?.name}</span>
                <button
                    onClick={logout}
                    className="text-left text-sm text-text-muted-light hover:text-accent"
                >
                    로그아웃
                </button>
            </div>
        ) : (
            <div className="flex flex-col gap-2">
                <Link href="/login" className="text-sm">
                    로그인
                </Link>
                <Link href="/signup" className="text-sm font-semibold text-accent">
                    회원가입
                </Link>
            </div>
        );
    }

    // desktop
    return isAuthenticated ? (
        <div className="flex items-center gap-3">
            <span className="text-sm">{user?.name}</span>
            <button onClick={logout} className="text-sm">
                로그아웃
            </button>
        </div>
    ) : (
        <div className="flex items-center gap-3">
            <Link href="/login" className="text-sm">
                로그인
            </Link>
            <Link href="/signup" className="text-sm font-semibold">
                회원가입
            </Link>
        </div>
    );
}
