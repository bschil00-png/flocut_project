"use client";

import { useParams, usePathname } from "next/navigation";
import Link from "next/link";

export default function SessionLayout({
                                          children,
                                      }: {
    children: React.ReactNode;
}) {
    const { sessionId } = useParams();
    const pathname = usePathname();

    const tabs = [
        { href: `/workspace/${sessionId}/notes`, label: "노트" },
        { href: `/workspace/${sessionId}/documents`, label: "문서" },
        { href: `/workspace/${sessionId}/audio`, label: "음성" },
        { href: `/workspace/${sessionId}/compare`, label: "비교" },
    ];

    return (
        <div className="h-full flex flex-col">
            {/* 세션 탭 영역 */}
            <div className="border-b px-6 py-2 flex gap-4">
                {tabs.map((tab) => {
                    const active = pathname.startsWith(tab.href);
                    return (
                        <Link
                            key={tab.href}
                            href={tab.href}
                            className={`text-sm ${
                                active ? "font-semibold text-accent" : "text-text-muted-light"
                            }`}
                        >
                            {tab.label}
                        </Link>
                    );
                })}
            </div>

            {/* 실제 콘텐츠 영역 */}
            <div className="flex-1 overflow-y-auto">
                {children}
            </div>
        </div>
    );
}
