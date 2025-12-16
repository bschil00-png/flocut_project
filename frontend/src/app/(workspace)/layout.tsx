// app/(workspace)/layout.tsx
"use client";

import "@/app/globals.css";
import { useState } from "react";
import GlobalNav from "@/app/components/layout/WorkspaceLayout/GlobalNav";
import WorkspaceHeader from "@/app/components/layout/WorkspaceLayout/WorkspaceHeader";
import FloatingChatButton from "@/app/components/chat/FloatingChatButton";
import ChatDrawer from "@/app/components/chat/ChatDrawer";
import GlobalLoader from "@/app/components/layout/loading/GlobalLoader";

export default function WorkspaceLayout({
                                            children,
                                        }: {
    children: React.ReactNode;
}) {
    const [globalNavCollapsed, setGlobalNavCollapsed] = useState(false);

    return (
        <div className="h-screen flex flex-col bg-background-light dark:bg-background-dark">
            {/* 상단 헤더 - 56px 고정 */}
            <WorkspaceHeader />

            {/* 메인 작업 영역 */}
            <div className="flex-1 flex overflow-hidden">
                {/* Global Navigation - 왼쪽 고정 */}
                <GlobalNav
                    collapsed={globalNavCollapsed}
                    onToggleCollapse={() => setGlobalNavCollapsed(!globalNavCollapsed)}
                />

                {/* Children: 노트 리스트, 에디터 등 */}
                <main className="flex-1 overflow-hidden">
                    {children}
                </main>
            </div>

            {/* 플로팅 채팅 버튼 & 드로어 */}
            <FloatingChatButton />
            <ChatDrawer />
            <GlobalLoader />
        </div>
    );
}