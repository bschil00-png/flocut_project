"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
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
        <header className="fixed top-0 z-[60] w-full h-16 bg-background-light dark:bg-background-dark border-b border-border-light dark:border-border-dark">
            <div className="mx-auto max-w-[1200px] h-full px-5">
                <div className="flex items-center justify-between h-full">

                    {/* 좌측: 로고 (flex-1로 영역 확보) */}
                    <div className="flex-1 flex justify-start">
                        <Link href="/" className="font-bold text-xl tracking-tighter text-text-primary-light dark:text-text-primary-dark">
                            FLOCUT
                        </Link>
                    </div>

                    {/* 중앙: 네비게이션 (고정 위치) */}
                    <nav className="hidden md:flex items-center gap-8">
                        {NAV_ITEMS.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className="text-sm font-semibold text-text-muted-light dark:text-text-muted-dark hover:text-accent transition-colors whitespace-nowrap"
                            >
                                {item.label}
                            </Link>
                        ))}
                    </nav>

                    {/* 우측: 인증부 (flex-1 및 고정 너비로 Layout Shift 방지) */}
                    <div className="flex-1 flex justify-end items-center">
                        <div className="hidden md:block min-w-[120px] text-right">
                            <HeaderClient />
                        </div>

                        <button
                            className="md:hidden p-2 -mr-2 text-text-primary-light dark:text-text-primary-dark"
                            onClick={() => setMobileOpen(!mobileOpen)}
                        >
                            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* 모바일 드로어: 이미지 기반 상단 우측 카드 스타일 */}
            {mobileOpen && (
                <div className="absolute top-16 right-0 w-full md:hidden">
                    <div className="fixed inset-0 top-16 bg-black/5" onClick={() => setMobileOpen(false)} />
                    <div className="relative bg-background-light dark:bg-surface-dark border-b border-border-light dark:border-border-dark flex flex-col items-center py-10 space-y-10 z-10 animate-scaleIn origin-top shadow-xl">
                        <nav className="flex flex-col items-center space-y-8">
                            {NAV_ITEMS.map((item) => (
                                <Link key={item.href} href={item.href} onClick={() => setMobileOpen(false)}
                                      className="text-lg font-bold text-text-primary-light dark:text-text-primary-dark active:text-accent">
                                    {item.label}
                                </Link>
                            ))}
                        </nav>
                        <div className="flex flex-col items-center gap-5">
                            <HeaderClient mobile onAction={() => setMobileOpen(false)} />
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
}