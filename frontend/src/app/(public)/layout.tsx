
import type { Metadata } from "next";
import Header from "@/app/components/layout/Header";
import Footer from "@/app/components/layout/Footer";
import FloatingChatButton from "@/app/components/chatbot/FloatingChatButton";
import ChatDrawer from "@/app/components/chatbot/ChatDrawer";

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
    <>
      <Header  />
      <main className="min-h-screen pt-16">
          {children}
      </main>
      {/* 챗봇*/}
        <FloatingChatButton />
        <ChatDrawer />
      <Footer />
    </>
  );
}
