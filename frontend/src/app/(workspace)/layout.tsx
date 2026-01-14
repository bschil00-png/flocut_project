"use client";

import "@/app/globals.css";
import {useState, useEffect, useRef} from "react";
import {useRouter, usePathname} from "next/navigation";

import {useAuthState} from "@/hooks/useAuthState";
import {useAuthActions} from "@/hooks/useAuthActions";
import {useMediaQuery} from "@/hooks/common/useMediaQuery";

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

    const {user, loading, initialized} = useAuthState();
    const {ensureAuth} = useAuthActions();

    const isMobile = useMediaQuery("(max-width: 768px)");
    const isTablet = useMediaQuery("(max-width: 1024px)");

    const [navMode, setNavMode] = useState<NavMode>("full");
    const [selectedSessionId, setSelectedSessionId] = useState<number | null>(null);
    const [manualToggle, setManualToggle] = useState(false); // 수동 토글 상태

    const authCheckedRef = useRef(false);

    // 인증 체크
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

    // 반응형 네비 - 수동 토글 우선
    useEffect(() => {
        if (manualToggle) return; // 수동 토글 중에는 자동 변경 무시

        if (isMobile) {
            setNavMode("hidden");
        } else if (isTablet) {
            setNavMode("icon");
        } else {
            setNavMode("full");
        }
    }, [isMobile, isTablet, manualToggle]);

    if (!initialized || loading || !user) return null;

    const isModalRoute = pathname.startsWith("/settings");

    const navViewMode: "full" | "icon" = navMode === "icon" ? "icon" : "full";

    // 수동 토글 핸들러
    const handleManualToggle = () => {
        setManualToggle(true);
        setNavMode((prev) => {
            if (prev === "full") return "icon";
            if (prev === "icon") return "full";
            return "full";
        });

        // 3초 후 수동 모드 해제 (반응형 다시 활성화)
        setTimeout(() => setManualToggle(false), 3000);
    };

    return (
        <div className="h-screen flex flex-col bg-background-light dark:bg-background-dark">
            {/* ================= Header ================= */}
            <WorkspaceHeader
                onMenuClick={() => {
                    setNavMode("full");
                }}
            />

            <div className="flex flex-1 min-h-0 relative">
                {/* ================= 모바일 네비 overlay ================= */}
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
                            ${isModalRoute ? "pointer-events-none opacity-60" : "z-50"}
                        `}
                    >
                        <GlobalNav
                            mode={navViewMode}
                            selectedSessionId={selectedSessionId}
                            onSessionSelect={(id) => {
                                if (isModalRoute) return;
                                setSelectedSessionId(id);
                                if (isMobile) setNavMode("hidden");
                            }}
                            onToggle={!isMobile ? handleManualToggle : undefined}
                        />
                    </div>
                )}

                {/* ================= Main ================= */}
                <main className="flex-1 min-w-0 min-h-0 overflow-hidden relative z-10">
                    {children}

                    {/* 플로팅 패널 전용 슬롯 */}
                    <div id="workspace-floating-root" className="relative z-20"/>
                </main>
            </div>
        </div>
    );
}