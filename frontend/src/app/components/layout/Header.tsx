"use client";

import Link from "next/link";
import HeaderClient from "./HeaderClient";

export default function Header() {
    return (
        <header className="fixed top-0 z-50 w-full h-16 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-xl border-b border-border-light dark:border-border-dark shadow-sm">
            <div className="mx-auto max-w-[1200px] h-full px-4">
                <div className="grid grid-cols-3 items-center h-full">
                    {/* 좌측: 로고 */}
                    <div className="flex items-center">
                        <Link
                            href="/"
                            className="group flex items-center gap-2"
                        >
                            <span className="font-bold text-xl text-text-primary-light dark:text-text-primary-dark group-hover:text-accent transition-colors">
                                FLOCUT
                            </span>
                        </Link>
                    </div>

                    {/* 중앙: 네비 */}
                    <nav className="hidden md:flex justify-center gap-1">
                        {[
                            { href: "/about", label: "회사 소개" },
                            { href: "/workspace", label: "스튜디오" },
                            { href: "/calendar", label: "캘린더" },
                            { href: "/support", label: "고객지원" }
                        ].map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className="px-4 py-2 rounded-lg text-sm font-medium text-text-muted-light dark:text-text-muted-dark hover:text-accent hover:bg-accent/5 transition-all"
                            >
                                {item.label}
                            </Link>
                        ))}
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