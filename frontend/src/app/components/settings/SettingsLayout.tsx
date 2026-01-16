"use client";

import { useState } from "react";
import { useMediaQuery } from "@/hooks/common/useMediaQuery";
import SettingsSidebar from "./SettingsSidebar";
import SettingsMobileDrawer from "@/app/components/settings/mobile/SettingsMobileDrawer";
import SettingsMobileHeader from "@/app/components/settings/mobile/SettingsMobileHeader";

export default function SettingsLayout({
                                           children,
                                       }: {
    children: React.ReactNode;
}) {
    const isMobile = useMediaQuery("(max-width: 768px)");
    const [menuOpen, setMenuOpen] = useState(false);

    if (isMobile) {
        return (
            <div className="h-full flex flex-col bg-background-light dark:bg-background-dark">
                {/* 모바일 헤더 */}
                <SettingsMobileHeader
                    open={menuOpen}
                    onMenuClick={() => setMenuOpen(true)}
                    onClose={() => setMenuOpen(false)}
                />

                {/* 모바일 메뉴 Drawer */}
                <SettingsMobileDrawer
                    open={menuOpen}
                    onClose={() => setMenuOpen(false)}
                />

                {/* 콘텐츠 */}
                <main className="flex-1 p-4">
                    {children}
                </main>
            </div>
        );
    }

    // 데스크톱
    return (
        <div className="flex h-full">
            <SettingsSidebar />
            <main className="flex-1 overflow-y-auto p-8">
                {children}
            </main>
        </div>
    );
}
