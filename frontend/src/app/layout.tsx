import type { Metadata } from "next";
import "@/app/globals.css";

import { Providers } from "@/provider/Providers";

import {notoSans} from "@/app/font";
import GlobalLoader from "@/app/components/layout/loading/GlobalLoader";

// 전역 레이아웃
// 환경 세팅만 담당
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
            {children}
        </Providers>
        </body>
        </html>
    );
}
