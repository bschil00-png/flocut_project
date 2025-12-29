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

    // 반응형 네비 상태 (모바일 여부, 접힘 여부)
    const { isCollapsed, isMobile, setCollapsed } = useResponsiveNav();

    // 모바일 네비 열림 상태
    const [openMobile, setOpenMobile] = useState(false);

    // 세션 생성 모달 상태
    const [openCreate, setOpenCreate] = useState(false);

    // 세션 목록 조회 (GraphQL)
    const { sessions, loading, refetch } = useSessions();

    // 전역 메뉴 (세션과 무관한 메뉴)
    const globalNav = [
        { href: "/", name: "홈", icon: Home },
        { href: "/recent", name: "최근 문서", icon: Clock },
        { href: "/favorites", name: "즐겨찾기", icon: Star },
        { href: "/notes", name: "모든 노트", icon: FileText },
        { href: "/shared", name: "공유 문서", icon: Users },
        { href: "/archive", name: "보관함", icon: Archive },
    ];

    // 전역 메뉴 렌더 함수
    const renderGlobalItem = (
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
                    ${active ? "bg-accent-soft text-accent" : "hover:bg-accent-soft"}
                    ${isCollapsed && !isMobile ? "justify-center" : ""}
                `}
            >
                <Icon size={18} />
                {(!isCollapsed || isMobile) && <span>{label}</span>}
            </Link>
        );
    };

    // 모바일 네비게이션
    if (isMobile) {
        return (
            <>
                {/* 모바일 햄버거 버튼 */}
                {!openMobile && (
                    <button
                        onClick={() => setOpenMobile(true)}
                        className="fixed top-3 left-3 z-40 p-2 rounded-md border bg-surface-light"
                    >
                        <Menu size={20} />
                    </button>
                )}

                <aside
                    className={`
                        fixed top-0 left-0 z-50 h-full w-64
                        bg-surface-light border-r
                        transition-transform duration-300
                        ${openMobile ? "translate-x-0" : "-translate-x-full"}
                    `}
                >
                    {/* 헤더 */}
                    <div className="h-14 px-3 flex items-center border-b">
                        <span className="font-semibold text-sm">개인 워크스페이스</span>
                        <button
                            onClick={() => setOpenMobile(false)}
                            className="ml-auto p-2"
                        >
                            <ChevronLeft size={20} />
                        </button>
                    </div>

                    <nav className="px-2 py-3 space-y-4">
                        {/* 전역 메뉴 */}
                        <div className="space-y-1">
                            {globalNav.map((item) =>
                                renderGlobalItem(
                                    item.href,
                                    item.name,
                                    item.icon,
                                    true
                                )
                            )}
                        </div>

                        {/* 세션 영역 */}
                        <div>
                            <p className="px-3 text-xs text-text-muted-light">
                                워크스페이스
                            </p>

                            {loading && (
                                <p className="px-3 text-xs text-text-muted-light">
                                    불러오는 중...
                                </p>
                            )}

                            {/* 모바일에서는 세션 수정/삭제 없이 이동만 */}
                            {sessions.map((s) => (
                                <Link
                                    key={s.sessionId}
                                    href={`/workspace/${s.sessionId}`}
                                    onClick={() => setOpenMobile(false)}
                                    className="flex items-center gap-3 px-3 py-2 rounded-md text-sm hover:bg-accent-soft"
                                >
                                    <Folder size={16} />
                                    <span className="truncate">
                                        {s.sessionTitle}
                                    </span>
                                </Link>
                            ))}

                            <button
                                onClick={() => setOpenCreate(true)}
                                className="flex items-center gap-2 px-3 py-2 text-xs hover:text-accent"
                            >
                                <Plus size={14} />
                                새 세션
                            </button>
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

    // 데스크탑 네비게이션
    return (
        <aside
            className={`
                h-screen flex-shrink-0 border-r
                bg-surface-light transition-all
                ${isCollapsed ? "w-16" : "w-60"}
            `}
        >
            {/* 헤더 */}
            <div className="h-14 px-3 flex items-center border-b">
                {!isCollapsed && (
                    <span className="font-semibold text-sm">
                        개인 워크스페이스
                    </span>
                )}
            </div>

            <nav className="flex-1 px-2 py-3 space-y-4 overflow-y-auto">
                {/* 전역 메뉴 */}
                <div className="space-y-1">
                    {globalNav.map((item) =>
                        renderGlobalItem(item.href, item.name, item.icon)
                    )}
                </div>

                {/* 세션 제목 */}
                {!isCollapsed && (
                    <p className="px-3 text-xs text-text-muted-light">
                        워크스페이스
                    </p>
                )}

                {/* 세션 리스트 */}
                <div className="space-y-1">
                    {sessions.map((s) => {
                        const active = pathname.startsWith(
                            `/workspace/${s.sessionId}`
                        );

                        return (
                            <SessionNavItem
                                key={s.sessionId}
                                sessionId={s.sessionId}
                                title={s.sessionTitle}
                                active={active}
                                collapsed={isCollapsed}
                                onUpdated={refetch}
                                onDeleted={refetch}
                            />
                        );
                    })}

                    {/* 세션 생성 버튼 */}
                    {!isCollapsed && (
                        <button
                            onClick={() => setOpenCreate(true)}
                            className="flex items-center gap-2 px-3 py-2 text-xs hover:text-accent"
                        >
                            <Plus size={14} />
                            새 세션
                        </button>
                    )}
                </div>
            </nav>

            {/* 접기 버튼 */}
            <div className="border-t p-2">
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

            <CreateSessionModal
                open={openCreate}
                onClose={() => setOpenCreate(false)}
            />
        </aside>
    );
}
