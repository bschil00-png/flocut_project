
import type { Metadata } from "next";
import Header from "@/app/components/layout/Header";
import Footer from "@/app/components/layout/Footer";
import FloatingChatButton from "@/app/components/chatbot/FloatingChatButton";
import ChatDrawer from "@/app/components/chatbot/ChatDrawer";
import GlobalLoader from "@/app/components/layout/loading/GlobalLoader";

export const metadata: Metadata = {
  title: "FLOCUT",
  description: "문서·음성 기반 AI 요약 플랫폼",
};
export default async function PublicLayout({
                                               children
                                           }: {
    children: React.ReactNode
}) {
    return (
        // overflow-x-hidden을 추가하여 모바일에서 좌우 흔들림 방지
        <div className="relative flex flex-col min-h-screen overflow-x-hidden">
            <Header />
            <main className="flex-1 pt-16">
                <GlobalLoader />
                {children}
            </main>
            <FloatingChatButton />
            <ChatDrawer />
            <Footer />
        </div>
    );
}