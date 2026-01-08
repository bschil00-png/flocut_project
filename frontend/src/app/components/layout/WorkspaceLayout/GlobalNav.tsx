"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
    Home,
    FileText,
    Sparkles,
    GitCompare,
    Star,
    Plus,
    Settings,
    ChevronLeft,
    ChevronRight,
    MoreVertical,
    Trash2,
    Calendar,
    FolderOpen,
} from "lucide-react";
import { useSessions } from "@/hooks/sessions/useSessions";
import CreateSessionModal from "../../sessions/CreateSessionModal";
import SessionEditModal from "@/app/components/sessions/SessionEditModal";
import SessionDeleteModal from "@/app/components/sessions/SessionDeleteModal";

interface Props {
    collapsed: boolean;
    onToggle: () => void;
    selectedSessionId: number | null;
    onSessionSelect: (sessionId: number) => void;
}

export default function GlobalNav({
                                      collapsed,
                                      onToggle,
                                      selectedSessionId,
                                      onSessionSelect,
                                  }: Props) {
    const router = useRouter();
    const [openCreate, setOpenCreate] = useState(false);
    const { sessions, refetch } = useSessions();

    const primaryNav = [
        { href: "/workspace", label: "대시보드", icon: Home },
        { href: "/recent", label: "최근 내역", icon: Calendar },
    ];

    const documentNav = [
        { href: "/documents", label: "원본 문서", icon: FileText },
        { href: "/summaries", label: "AI 요약본", icon: Sparkles },
        { href: "/comparisons", label: "문서 비교", icon: GitCompare },
    ];

    const quickNav = [
        { href: "/favorites", label: "즐겨찾기", icon: Star },
    ];

    const handleTrashClick = () => {
        if (selectedSessionId) {
            router.push(`/workspace/${selectedSessionId}/trash`);
        } else if (sessions.length > 0) {
            router.push(`/workspace/${sessions[0].sessionId}/trash`);
        }
    };

    return (
        <aside
            className={`
                h-full flex-shrink-0 transition-all duration-300
                bg-surface-light dark:bg-surface-dark
                ${collapsed ? "w-16" : "w-64"}
            `}
        >
            <nav className="flex flex-col h-full">
                {/* Header - 보더를 제거하고 배경으로 구분 */}
                <div className={`h-14 flex items-center px-4 ${collapsed ? "justify-center" : "justify-between"}`}>
                    {!collapsed && (
                        <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-lg bg-accent flex items-center justify-center shadow-sm">
                                <Sparkles size={16} className="text-white" />
                            </div>
                            <span className="font-bold text-base text-text-primary-light dark:text-text-primary-dark tracking-tight">
                                FLOCUT
                            </span>
                        </div>
                    )}
                    <button
                        onClick={onToggle}
                        className="p-1.5 text-text-muted-light dark:text-text-muted-dark hover:bg-accent-soft hover:text-accent rounded-lg transition-colors"
                    >
                        {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
                    </button>
                </div>

                {/* Main Content - 실처럼 얇은 커스텀 스크롤바 적용 */}
                <div className="flex-1 overflow-y-auto p-3 space-y-6 custom-scrollbar">
                    {/* Primary Actions */}
                    <div className="space-y-1">
                        {primaryNav.map((item) => (
                            <button
                                key={item.href}
                                onClick={() => router.push(item.href)}
                                className={`
                                    w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all
                                    ${collapsed ? "justify-center" : ""}
                                    text-text-primary-light dark:text-text-primary-dark
                                    hover:bg-accent-soft whitespace-nowrap border border-transparent hover:border-black/5 dark:hover:border-white/5
                                `}
                            >
                                <item.icon size={18} className="text-accent shrink-0" />
                                {!collapsed && <span>{item.label}</span>}
                            </button>
                        ))}
                    </div>

                    {/* 문서 관리 */}
                    {!collapsed && (
                        <div>
                            <div className="px-3 mb-2">
                                <span className="text-[11px] font-bold text-text-muted-light dark:text-text-muted-dark uppercase tracking-widest opacity-60">문서 관리</span>
                            </div>
                            <div className="space-y-1">
                                {documentNav.map((item) => (
                                    <button
                                        key={item.href}
                                        onClick={() => router.push(item.href)}
                                        className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-text-primary-light dark:text-text-primary-dark hover:bg-accent-soft hover:text-accent transition-all whitespace-nowrap border border-transparent hover:border-black/5 dark:hover:border-white/5"
                                    >
                                        <item.icon size={16} className="text-accent shrink-0" />
                                        <span>{item.label}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* 빠른 접근 */}
                    {!collapsed && (
                        <div>
                            <div className="px-3 mb-2">
                                <span className="text-[11px] font-bold text-text-muted-light dark:text-text-muted-dark uppercase tracking-widest opacity-60">빠른 접근</span>
                            </div>
                            <div className="space-y-1">
                                {quickNav.map((item) => (
                                    <button
                                        key={item.href}
                                        onClick={() => router.push(item.href)}
                                        className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-text-primary-light dark:text-text-primary-dark hover:bg-accent-soft hover:text-accent transition-all whitespace-nowrap border border-transparent hover:border-black/5 dark:hover:border-white/5"
                                    >
                                        <item.icon size={16} className="text-accent shrink-0" />
                                        <span>{item.label}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* 프로젝트 세션 리스트 */}
                    <div>
                        <div className={`flex items-center justify-between px-3 mb-2 ${collapsed ? "justify-center" : ""}`}>
                            {!collapsed ? (
                                <>
                                    <span className="text-[11px] font-bold text-text-muted-light dark:text-text-muted-dark uppercase tracking-widest opacity-60">프로젝트</span>
                                    <button
                                        onClick={() => setOpenCreate(true)}
                                        className="p-1 text-text-muted-light hover:text-accent hover:bg-accent-soft rounded-md transition-all"
                                    >
                                        <Plus size={14} />
                                    </button>
                                </>
                            ) : (
                                <button onClick={() => setOpenCreate(true)} className="p-1.5 hover:bg-accent-soft rounded-lg text-text-muted-light hover:text-accent">
                                    <Plus size={18} />
                                </button>
                            )}
                        </div>

                        {!collapsed && sessions.length > 0 ? (
                            <div className="space-y-1.5">
                                {sessions.map((session) => (
                                    <SessionItem
                                        key={session.sessionId}
                                        session={session}
                                        isSelected={selectedSessionId === session.sessionId}
                                        onSelect={() => {
                                            onSessionSelect(session.sessionId);
                                            router.push(`/workspace/${session.sessionId}`);
                                        }}
                                        onUpdated={refetch}
                                        onDeleted={refetch}
                                    />
                                ))}
                            </div>
                        ) : !collapsed && (
                            <div className="px-3 py-8 text-center bg-background-light dark:bg-surface-input rounded-xl">
                                <FolderOpen size={24} className="mx-auto mb-2 text-text-muted-light opacity-20" />
                                <p className="text-xs text-text-muted-light">프로젝트가 없습니다</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer */}
                <div className="p-3 space-y-1">
                    <button
                        onClick={handleTrashClick}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-text-muted-light dark:text-text-muted-dark hover:text-red-500 hover:bg-red-50 transition-all ${collapsed ? "justify-center" : ""} whitespace-nowrap border border-transparent hover:border-red-200`}
                    >
                        <Trash2 size={18} className="shrink-0" />
                        {!collapsed && <span>휴지통</span>}
                    </button>
                    <button
                        onClick={() => router.push("/settings/profile")}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-text-primary-light dark:text-text-primary-dark hover:bg-accent-soft hover:text-accent transition-all ${collapsed ? "justify-center" : ""} whitespace-nowrap border border-transparent hover:border-black/5 dark:hover:border-white/5`}
                    >
                        <Settings size={18} className="text-accent shrink-0" />
                        {!collapsed && <span>설정</span>}
                    </button>
                </div>
            </nav>
            <CreateSessionModal open={openCreate} onClose={() => { setOpenCreate(false); refetch(); }} />
        </aside>
    );
}

// 개별 세션 아이템 컴포넌트
function SessionItem({ session, isSelected, onSelect, onUpdated, onDeleted }: any) {
    const [openEdit, setOpenEdit] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);
    const [showMenu, setShowMenu] = useState(false);

    return (
        <div className="relative group">
            <button
                onClick={onSelect}
                className={`
                    w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all whitespace-nowrap
                    border
                    ${isSelected
                    ? "bg-accent-soft border-accent/20 text-accent font-semibold shadow-sm translate-x-1"
                    : "bg-white/50 dark:bg-surface-input border-black/5 dark:border-white/5 text-text-primary-light dark:text-text-primary-dark hover:bg-accent-soft hover:border-accent/10"
                }
                `}
            >
                <FolderOpen size={16} className={isSelected ? "text-accent" : "text-accent opacity-60"} />
                <span className="flex-1 truncate text-left">{session.sessionTitle}</span>
                {!isSelected && (
                    <MoreVertical
                        size={14}
                        className="opacity-0 group-hover:opacity-100 transition-opacity text-text-muted-light hover:text-accent p-0.5 rounded"
                        onClick={(e) => { e.stopPropagation(); setShowMenu(!showMenu); }}
                    />
                )}
            </button>

            {showMenu && (
                <>
                    <div className="fixed inset-0 z-40" onClick={() => setShowMenu(false)} />
                    <div className="absolute right-0 top-10 w-36 rounded-xl bg-white dark:bg-surface-dark shadow-2xl z-50 overflow-hidden py-1">
                        <button
                            onClick={() => { setShowMenu(false); setOpenEdit(true); }}
                            className="w-full px-4 py-2 text-sm text-left hover:bg-accent-soft hover:text-accent transition-colors"
                        >
                            이름 변경
                        </button>
                        <button
                            onClick={() => { setShowMenu(false); setOpenDelete(true); }}
                            className="w-full px-4 py-2 text-sm text-left text-red-500 hover:bg-red-50 transition-colors"
                        >
                            삭제
                        </button>
                    </div>
                </>
            )}

            <SessionEditModal
                open={openEdit}
                onClose={() => setOpenEdit(false)}
                sessionId={session.sessionId}
                initialTitle={session.sessionTitle}
                onUpdated={onUpdated}
            />
            <SessionDeleteModal
                open={openDelete}
                onClose={() => setOpenDelete(false)}
                sessionId={session.sessionId}
                sessionTitle={session.sessionTitle}
                onDeleted={onDeleted}
            />
        </div>
    );
}