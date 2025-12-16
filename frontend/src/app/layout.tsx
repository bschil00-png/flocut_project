import type { Metadata } from "next";
import "@/app/globals.css";

import Header from "@/app/components/layout/Header";
import Footer from "@/app/components/layout/Footer";
import { Providers } from "@/provider/Providers";
import FloatingChatButton from "@/app/components/chat/FloatingChatButton";
import ChatDrawer from "@/app/components/chat/ChatDrawer";
import {notoSans} from "@/app/font";
import GlobalLoader from "@/app/components/layout/loading/GlobalLoader";


export const metadata: Metadata = {
  title: "FLOCUT",
  description: "문서·음성 기반 AI 요약 플랫폼",
};

export default function RootLayout({
                                     children,
                                   }: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" suppressHydrationWarning>
    <body
      className={`
          ${notoSans.variable}
          font-sans
          bg-background-light text-text-primary-light
          dark:bg-background-dark dark:text-text-primary-dark
        `}
    >
    <Providers>
        <GlobalLoader />
      <Header />
      <main className="min-h-screen pt-16">
        {children}
        <FloatingChatButton />
        <ChatDrawer />
      </main>
      <Footer />
    </Providers>
    </body>
    </html>
  );
}
