"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import HeaderClient from "./HeaderClient";

const NAV_ITEMS = [
    { href: "/about", label: "회사 소개" },
    { href: "/workspace", label: "스튜디오" },
    { href: "/calendar", label: "캘린더" },
    { href: "/support", label: "고객지원" },
];

export default function Header() {
    const [mobileOpen, setMobileOpen] = useState(false);

    return (
        <header className="fixed top-0 z-50 w-full h-16 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-xl border-b border-border-light dark:border-border-dark">
            <div className="mx-auto max-w-[1200px] h-full px-4">
                {/* HEADER BAR */}
                <div className="grid grid-cols-3 items-center h-full">
                    {/* 좌측: 로고 */}
                    <div className="flex items-center">
                        <Link
                            href="/"
                            className="font-bold text-xl text-text-primary-light dark:text-text-primary-dark"
                        >
                            FLOCUT
                        </Link>
                    </div>

                    {/* 중앙: 네비 (md 이상) */}
                    <nav className="hidden md:flex justify-center gap-1">
                        {NAV_ITEMS.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className="px-4 py-2 rounded-lg text-sm font-medium
                  text-text-muted-light dark:text-text-muted-dark
                  hover:text-accent hover:bg-accent/5 transition"
                            >
                                {item.label}
                            </Link>
                        ))}
                    </nav>

                    {/* 우측 */}
                    <div className="flex justify-end items-center">
                        {/* 모바일: 햄버거만 */}
                        <button
                            className="md:hidden p-2 rounded-lg hover:bg-accent/10"
                            onClick={() => setMobileOpen(true)}
                            aria-label="메뉴 열기"
                        >
                            <Menu size={20} />
                        </button>

                        {/* 데스크탑: 인증 영역 */}
                        <div className="hidden md:block">
                            <HeaderClient />
                        </div>
                    </div>
                </div>
            </div>

            {/* MOBILE DRAWER */}
            {mobileOpen && (
                <div className="fixed inset-0 z-50 md:hidden">
                    {/* overlay (헤더 아래부터) */}
                    <div
                        className="absolute inset-0 top-16 bg-black/40"
                        onClick={() => setMobileOpen(false)}
                    />

                    {/* drawer */}
                    <aside
                        className="
              absolute right-0 top-16
              h-[calc(100vh-4rem)]
              w-72
              bg-background-light dark:bg-background-dark
              shadow-xl
              flex flex-col
            "
                    >
                        {/* drawer header */}
                        <div className="flex items-center justify-between h-14 px-4 border-b border-border-light dark:border-border-dark">
                            <span className="text-sm font-semibold">메뉴</span>
                            <button
                                onClick={() => setMobileOpen(false)}
                                aria-label="메뉴 닫기"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        {/* nav */}
                        <nav className="flex flex-col px-4 py-4 gap-1">
                            {NAV_ITEMS.map((item) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={() => setMobileOpen(false)}
                                    className="
                    px-3 py-2 rounded-lg text-sm text-left
                    hover:bg-accent/10
                  "
                                >
                                    {item.label}
                                </Link>
                            ))}
                        </nav>

                        {/* auth (하단 고정) */}
                        <div className="mt-auto px-4 py-4 border-t border-border-light dark:border-border-dark">
                            <HeaderClient mobile />
                        </div>
                    </aside>
                </div>
            )}
        </header>
    );
}
