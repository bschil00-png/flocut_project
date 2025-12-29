"use client";

import "@/app/globals.css";
import { useState, useEffect, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuthState } from "@/hooks/useAuthState";
import { useAuthActions } from "@/hooks/useAuthActions";

import GlobalNav from "@/app/components/layout/WorkspaceLayout/GlobalNav";
import WorkspaceHeader from "@/app/components/layout/WorkspaceLayout/WorkspaceHeader";

export default function WorkspaceLayout({ children }: { children: React.ReactNode }) {
    const [collapsed, setCollapsed] = useState(false);
    const router = useRouter();
    const pathname = usePathname();

    const { user, loading } = useAuthState();
    const { ensureAuth, logout } = useAuthActions();
    const checkedRef = useRef(false);

    // 보호 페이지 진입 시 반드시 인증 보장
    useEffect(() => {
        if (checkedRef.current) return;
        checkedRef.current = true;

        (async () => {
            const ok = await ensureAuth();
            if (!ok) {
                router.replace(`/login?from=${pathname}`);
            }
        })();
    }, [ensureAuth, pathname, router]);

    // 전역 로그아웃 이벤트
    useEffect(() => {
        const handleLogout = () => {
            logout().then(() => router.replace("/login"));
        };

        window.addEventListener("auth:logout", handleLogout);
        return () => window.removeEventListener("auth:logout", handleLogout);
    }, [logout, router]);

    if (loading || !user) {
        return (
            <div className="h-screen flex items-center justify-center">
                인증 확인 중...
            </div>
        );
    }

    return (
        <div className="h-screen flex flex-col bg-background-light dark:bg-background-dark">
            <WorkspaceHeader />
            <div className="flex-1 flex overflow-hidden">
                <GlobalNav
                    collapsed={collapsed}
                    onToggleCollapse={() => setCollapsed(!collapsed)}
                />
                <main className="flex-1 overflow-hidden">
                    {children}
                </main>
            </div>
        </div>
    );
}
