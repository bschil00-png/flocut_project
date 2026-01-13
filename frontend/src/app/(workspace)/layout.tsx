"use client";

import "@/app/globals.css";
import { useState, useEffect, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";

import { useAuthState } from "@/hooks/useAuthState";
import { useAuthActions } from "@/hooks/useAuthActions";
import { useMediaQuery } from "@/hooks/common/useMediaQuery";

import GlobalNav from "@/app/components/layout/WorkspaceLayout/GlobalNav";
import WorkspaceHeader from "@/app/components/layout/WorkspaceLayout/workspace/WorkspaceHeader";

export type NavMode = "full" | "icon" | "hidden";

export default function WorkspaceLayout({
                                            children,
                                        }: {
    children: React.ReactNode;
}) {
    const router = useRouter();
    const pathname = usePathname();

    const { user, loading, initialized } = useAuthState();
    const { ensureAuth } = useAuthActions();

    const isMobile = useMediaQuery("(max-width: 768px)");
    const isTablet = useMediaQuery("(max-width: 1024px)");

    const [navMode, setNavMode] = useState<NavMode>("full");
    const [selectedSessionId, setSelectedSessionId] =
        useState<number | null>(null);

    const authCheckedRef = useRef(false);

    /** ================= 인증 ================= */
    useEffect(() => {
        if (authCheckedRef.current) return;
        authCheckedRef.current = true;
        ensureAuth();
    }, [ensureAuth]);

    useEffect(() => {
        if (!initialized || loading) return;
        if (!user) {
            router.replace(`/login?from=${pathname}`);
        }
    }, [initialized, loading, user, pathname, router]);

    /** ================= 반응형 네비 ================= */
    useEffect(() => {
        if (isMobile) {
            setNavMode("hidden");
        } else if (isTablet) {
            setNavMode("icon");
        } else {
            setNavMode("full");
        }
    }, [isMobile, isTablet]);

    if (!initialized || loading || !user) return null;

    /** ================= 모달 라우트 판별 ================= */
    const isModalRoute = pathname.startsWith("/settings");

    /** GlobalNav에는 hidden을 넘기지 않는다 */
    const navViewMode: "full" | "icon" =
        navMode === "icon" ? "icon" : "full";

    return (
        <div className="h-screen flex flex-col bg-background-light dark:bg-background-dark">
            {/* ================= Header ================= */}
            <WorkspaceHeader
                onMenuClick={() => {
                    // 모바일: hidden → full
                    // 태블릿: icon → full
                    setNavMode("full");
                }}
            />

            <div className="flex flex-1 min-h-0 relative">
                {/* ================= 모바일 네비 overlay (투명) ================= */}
                {isMobile && navMode === "full" && (
                    <div
                        className="fixed inset-0 top-14 z-40 bg-transparent"
                        onClick={() => setNavMode("hidden")}
                    />
                )}

                {/* ================= GlobalNav ================= */}
                {navMode !== "hidden" && (
                    <div
                        className={`
              relative flex-shrink-0
              ${
                            isModalRoute
                                ? "pointer-events-none opacity-60"
                                : "z-50"
                        }
            `}
                    >
                        <GlobalNav
                            mode={navViewMode}
                            selectedSessionId={selectedSessionId}
                            onSessionSelect={(id) => {
                                if (isModalRoute) return; //  모달일 땐 완전 차단
                                setSelectedSessionId(id);
                                if (isMobile) setNavMode("hidden");
                            }}
                        />
                    </div>
                )}

                {/* ================= Main ================= */}
                <main className="flex-1 min-w-0 min-h-0 overflow-hidden relative z-10">
                    {children}
                </main>
            </div>
        </div>
    );
}
