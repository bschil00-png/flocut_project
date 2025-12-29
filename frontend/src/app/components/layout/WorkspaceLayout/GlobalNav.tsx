"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    Home,
    Clock,
    Star,
    FileText,
    Users,
    Archive,
    Folder,
    Plus,
    Settings,
    ChevronLeft,
    ChevronRight,
    Menu,
} from "lucide-react";
import { useState } from "react";

import IconButton from "@/app/components/ui/icon-button/IconButton";
import useResponsiveNav from "@/hooks/useResponsiveNav";
import { useSessions } from "@/hooks/sessions/useSessions";
import CreateSessionModal from "./CreateSessionModal";
import SessionNavItem from "./SessionNavItem";

export default function GlobalNav() {
    const pathname = usePathname();

    // 반응형 네비 상태
    const { isCollapsed, isMobile, setCollapsed } = useResponsiveNav();

    // 모바일 메뉴 / 세션 생성 모달 상태
    const [openMobile, setOpenMobile] = useState(false);
    const [openCreate, setOpenCreate] = useState(false);

    // 세션 목록
    const { sessions, refetch } = useSessions();

    // 상단 고정 네비 목록
    const globalNav = [
        { href: "/", label: "홈", icon: Home },
        { href: "/recent", label: "최근 문서", icon: Clock },
        { href: "/favorites", label: "즐겨찾기", icon: Star },
        { href: "/notes", label: "모든 노트", icon: FileText },
        { href: "/shared", label: "공유 문서", icon: Users },
        { href: "/archive", label: "보관함", icon: Archive },
    ];

    // 네비 아이템 렌더링 함수
    const renderItem = (
        href: string,
        label: string,
        Icon: any,
        closeMobile?: boolean
    ) => {
        const active = pathname === href;

        return (
            <Link
                key={href}
                href={href}
                onClick={() => closeMobile && setOpenMobile(false)}
                className={`
          flex items-center gap-3 px-3 py-2 rounded-md text-sm
          text-text-muted-light dark:text-text-muted-dark
          hover:bg-accent-soft
          ${active ? "bg-accent-soft text-accent" : ""}
          ${isCollapsed && !isMobile ? "justify-center" : ""}
        `}
            >
                <Icon size={18} />
                {(!isCollapsed || isMobile) && <span>{label}</span>}
            </Link>
        );
    };

    // 모바일 네비
    if (isMobile) {
        return (
            <>
                {!openMobile && (
                    <button
                        onClick={() => setOpenMobile(true)}
                        className="
              fixed top-3 left-3 z-40 p-2 rounded-md
              bg-surface-light dark:bg-surface-dark
              border border-border-light dark:border-border-dark
            "
                    >
                        <Menu size={20} />
                    </button>
                )}

                <aside
                    className={`
            fixed inset-y-0 left-0 z-50 w-64
            bg-surface-light dark:bg-surface-dark
            border-r border-border-light dark:border-border-dark
            transition-transform
            ${openMobile ? "translate-x-0" : "-translate-x-full"}
          `}
                >
                    <nav className="flex flex-col h-full px-2 py-3">
                        <div className="space-y-1">
                            {globalNav.map((item) =>
                                renderItem(item.href, item.label, item.icon, true)
                            )}
                        </div>

                        {/* 세션 생성 버튼 */}
                        <div className="mt-4">
                            <button
                                onClick={() => {
                                    setOpenCreate(true);
                                    setOpenMobile(false);
                                }}
                                className="
                  flex items-center gap-3 px-3 py-2 rounded-md text-sm
                  text-text-muted-light dark:text-text-muted-dark
                  hover:bg-accent-soft
                "
                            >
                                <Plus size={16} />
                                <span>새 세션 만들기</span>
                            </button>

                            {sessions.map((s) => (
                                <Link
                                    key={s.sessionId}
                                    href={`/workspace/${s.sessionId}`}
                                    onClick={() => setOpenMobile(false)}
                                    className="
                    flex items-center gap-3 px-3 py-2 rounded-md text-sm
                    text-text-muted-light dark:text-text-muted-dark
                    hover:bg-accent-soft
                  "
                                >
                                    <Folder size={16} />
                                    <span className="truncate">{s.sessionTitle}</span>
                                </Link>
                            ))}
                        </div>

                        <div className="mt-auto border-t border-border-light dark:border-border-dark pt-2">
                            <Link
                                href="/settings/profile"
                                className="
                  flex items-center gap-3 px-3 py-2 text-sm
                  text-text-muted-light dark:text-text-muted-dark
                  hover:bg-accent-soft
                "
                            >
                                <Settings size={18} />
                                설정
                            </Link>
                        </div>
                    </nav>
                </aside>

                <CreateSessionModal
                    open={openCreate}
                    onClose={() => setOpenCreate(false)}
                />
            </>
        );
    }

    // PC 네비
    return (
        <aside
            className={`
        h-full flex-shrink-0
        bg-surface-light dark:bg-surface-dark
        border-r border-border-light dark:border-border-dark
        transition-all
        ${isCollapsed ? "w-16" : "w-60"}
      `}
        >
            <nav className="flex flex-col h-full px-2 py-3">
                <div className="space-y-1">
                    {globalNav.map((item) =>
                        renderItem(item.href, item.label, item.icon)
                    )}
                </div>

                {/* 세션 영역 */}
                <div className="mt-4 space-y-1">
                    <button
                        onClick={() => setOpenCreate(true)}
                        className={`
              flex items-center gap-3 px-3 py-2 rounded-md text-sm
              text-text-muted-light dark:text-text-muted-dark
              hover:bg-accent-soft
              ${isCollapsed ? "justify-center" : ""}
            `}
                    >
                        <Plus size={16} />
                        {!isCollapsed && <span>새 세션 만들기</span>}
                    </button>

                    {sessions.map((s) => (
                        <SessionNavItem
                            key={s.sessionId}
                            sessionId={s.sessionId}
                            title={s.sessionTitle}
                            active={pathname.startsWith(`/workspace/${s.sessionId}`)}
                            collapsed={isCollapsed}
                            onUpdated={refetch}
                            onDeleted={refetch}
                        />
                    ))}
                </div>

                <div className="mt-auto border-t border-border-light dark:border-border-dark pt-2 space-y-2">
                    <Link
                        href={`/settings/profile?from=${encodeURIComponent(pathname)}`}
                        className={`
              flex items-center gap-3 px-3 py-2 rounded-md text-sm
              text-text-muted-light dark:text-text-muted-dark
              hover:bg-accent-soft
              ${isCollapsed ? "justify-center" : ""}
            `}
                    >
                        <Settings size={18} />
                        {!isCollapsed && <span>설정</span>}
                    </Link>

                    <IconButton
                        icon={
                            isCollapsed ? (
                                <ChevronRight size={18} />
                            ) : (
                                <ChevronLeft size={18} />
                            )
                        }
                        onClick={() => setCollapsed(!isCollapsed)}
                        className="w-10 h-10 mx-auto"
                    />
                </div>
            </nav>

            <CreateSessionModal
                open={openCreate}
                onClose={() => setOpenCreate(false)}
            />
        </aside>
    );
}
