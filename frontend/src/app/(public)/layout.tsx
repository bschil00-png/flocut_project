import type { Metadata } from "next";
import "@/app/globals.css";

import Header from "@/app/components/layout/Header";
import Footer from "@/app/components/layout/Footer";
import FloatingChatButton from "@/app/components/chat/FloatingChatButton";
import ChatDrawer from "@/app/components/chat/ChatDrawer";

// 퍼블릭 (인덱스나 서비스 쪽 레이아웃)
export const metadata: Metadata = {
  title: "FLOCUT",
  description: "문서·음성 기반 AI 요약 플랫폼",
};

export default function PublicLayout({
                                         children,
                                     }: {
    children: React.ReactNode;
}) {
    return (
        <>
            <Header />
            <main className="min-h-screen pt-16">
                {children}
                <FloatingChatButton/>
                <ChatDrawer/>
            </main>
            <Footer />
        </>
    );
}
