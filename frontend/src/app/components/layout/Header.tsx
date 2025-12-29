"use client";
import Link from "next/link";
import HeaderClient from "./HeaderClient";

export default function Header() {
    return (
        <header
            className="
        fixed top-0 z-50 w-full h-16
        border-b
        bg-background-light/80 dark:bg-background-dark/80
        backdrop-blur-xl
        border-border-light dark:border-border-dark
      "
        >
            {/* RootLayout와 동일한 기준 */}
            <div className="mx-auto max-w-[1200px] h-full px-4">
                <div className="grid grid-cols-3 items-center h-full">

                    {/* 좌측: 로고 */}
                    <div className="flex items-center">
                        <Link
                            href="/"
                            className="
                font-bold text-xl
                text-text-primary-light
                dark:text-text-primary-dark
                hover:text-accent
                transition-colors
              "
                        >
                            FLOCUT
                        </Link>
                    </div>

                    {/* 중앙: 네비 */}
                    <nav
                        className="
              hidden md:flex justify-center gap-8
              text-sm font-medium
              text-text-muted-light
              dark:text-text-muted-dark
            "
                    >
                        <Link href="/about" className="hover:text-text-primary-light dark:hover:text-text-primary-dark">
                            회사 소개
                        </Link>
                        <Link href="/workspace" className="hover:text-text-primary-light dark:hover:text-text-primary-dark">
                            스튜디오
                        </Link>
                        <Link href="/calendar" className="hover:text-text-primary-light dark:hover:text-text-primary-dark">
                            캘린더
                        </Link>
                        <Link href="/support" className="hover:text-text-primary-light dark:hover:text-text-primary-dark">
                            고객지원
                        </Link>
                    </nav>

                    {/* 우측: 사용자 영역 */}
                    <div className="flex justify-end">
                        <HeaderClient />
                    </div>

                </div>
            </div>
        </header>
    );
}
