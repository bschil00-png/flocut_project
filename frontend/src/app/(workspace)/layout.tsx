// src/app/(workspace)/layout.tsx
"use client";

import "@/app/globals.css";
import { useState } from "react";

import GlobalNav from "@/app/components/layout/WorkspaceLayout/GlobalNav";
import WorkspaceHeader from "@/app/components/layout/WorkspaceLayout/WorkspaceHeader";

import FloatingChatButton from "@/app/components/chat/FloatingChatButton";
import ChatDrawer from "@/app/components/chat/ChatDrawer";
import GlobalLoader from "@/app/components/layout/loading/GlobalLoader";

export default function WorkspaceLayout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="h-screen flex flex-col bg-background-light dark:bg-background-dark">

      {/* 상단 헤더 */}
      <WorkspaceHeader />

      {/* 메인 레이아웃 */}
      <div className="flex-1 flex overflow-hidden">

        {/* 왼쪽 네비게이션 */}
        <GlobalNav
          collapsed={collapsed}
          onToggleCollapse={() => setCollapsed(!collapsed)}
        />


        {/* 페이지 본문 */}
        <main className="flex-1 overflow-hidden">
          {children}
        </main>
      </div>

      <FloatingChatButton />
      <ChatDrawer />
      <GlobalLoader />
    </div>
  );
}
