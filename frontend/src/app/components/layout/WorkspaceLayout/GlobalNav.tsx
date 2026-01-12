"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
    Home,
    Calendar,
    FileText,
    Sparkles,
    GitCompare,
    Star,
    Plus,
    Settings,
    ChevronLeft,
    ChevronRight,
    FolderOpen,
    StickyNote,
    Trash2,
    ChevronDown,
} from "lucide-react";

import CreateSessionModal from "../../sessions/CreateSessionModal";
import SessionEditModal from "@/app/components/sessions/SessionEditModal";
import SessionDeleteModal from "@/app/components/sessions/SessionDeleteModal";
import {useMySessions} from "@/hooks/sessions/usrMySession";

/* =========================
   Types
   ========================= */

interface Session {
    sessionId: number;
    sessionTitle: string;
}

interface Props {
    collapsed: boolean;
    onToggle: () => void;
    selectedSessionId: number | null;
    onSessionSelect: (sessionId: number) => void;
}

/* =========================
   GlobalNav
   ========================= */

export default function GlobalNav({
                                      collapsed,
                                      onToggle,
                                      selectedSessionId,
                                      onSessionSelect,
                                  }: Props) {
    const router = useRouter();
    const [openCreate, setOpenCreate] = useState(false);

    // 네비 전용 세션 조회 (페이지네이션 없음)
    const { sessions, refetch } = useMySessions();

    /* =========================
       기존 네비 섹션 복구
       ========================= */

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

    return (
        <aside
            className={`
        h-full flex-shrink-0 transition-all duration-300
        bg-surface-light dark:bg-surface-dark
        ${collapsed ? "w-16" : "w-64"}
      `}
        >
            <nav className="flex flex-col h-full">
                {/* ================= Header ================= */}
                <div className="h-14 flex items-center justify-between px-4">
                    {!collapsed && <span className="font-bold">FLOCUT</span>}
                    <button onClick={onToggle}>
                        {collapsed ? <ChevronRight /> : <ChevronLeft />}
                    </button>
                </div>

                {/* ================= Main ================= */}
                <div className="flex-1 overflow-y-auto p-3 space-y-6">
                    {/* ---------- Primary Nav ---------- */}
                    <div className="space-y-1">
                        {primaryNav.map((item) => (
                            <NavButton
                                key={item.href}
                                icon={item.icon}
                                label={item.label}
                                collapsed={collapsed}
                                onClick={() => router.push(item.href)}
                            />
                        ))}
                    </div>

                    {/* ---------- Document Nav ---------- */}
                    {!collapsed && (
                        <div>
                            <div className="px-2 mb-2 text-[11px] font-bold opacity-60 uppercase">
                                문서 관리
                            </div>
                            <div className="space-y-1">
                                {documentNav.map((item) => (
                                    <NavButton
                                        key={item.href}
                                        icon={item.icon}
                                        label={item.label}
                                        collapsed={false}
                                        onClick={() => router.push(item.href)}
                                    />
                                ))}
                            </div>
                        </div>
                    )}

                    {/* ---------- Quick Nav ---------- */}
                    {!collapsed && (
                        <div>
                            <div className="px-2 mb-2 text-[11px] font-bold opacity-60 uppercase">
                                빠른 접근
                            </div>
                            <div className="space-y-1">
                                {quickNav.map((item) => (
                                    <NavButton
                                        key={item.href}
                                        icon={item.icon}
                                        label={item.label}
                                        collapsed={false}
                                        onClick={() => router.push(item.href)}
                                    />
                                ))}
                            </div>
                        </div>
                    )}

                    {/* ---------- Sessions ---------- */}
                    {!collapsed && (
                        <div>
                            <div className="flex items-center justify-between mb-2 px-2">
                <span className="text-[11px] font-bold opacity-60 uppercase">
                  프로젝트
                </span>
                                <button onClick={() => setOpenCreate(true)}>
                                    <Plus size={14} />
                                </button>
                            </div>

                            <div className="space-y-1">
                                {sessions.map((session) => (
                                    <SessionItem
                                        key={session.sessionId}
                                        session={session}
                                        active={selectedSessionId === session.sessionId}
                                        onSelect={() => {
                                            onSessionSelect(session.sessionId);
                                            router.push(`/workspace/${session.sessionId}`);
                                        }}
                                        onUpdated={refetch}
                                        onDeleted={refetch}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* ================= Footer ================= */}
                <div className="p-3 space-y-1">
                    <NavButton
                        icon={Trash2}
                        label="휴지통"
                        collapsed={collapsed}
                        danger
                        onClick={() => router.push("/trash")}
                    />

                    <NavButton
                        icon={Settings}
                        label="설정"
                        collapsed={collapsed}
                        onClick={() => router.push("/settings/profile")}
                    />
                </div>
            </nav>

            {/* ================= Modals ================= */}
            <CreateSessionModal
                open={openCreate}
                onClose={() => {
                    setOpenCreate(false);
                    refetch();
                }}
            />
        </aside>
    );
}

/* =========================
   SessionItem
   ========================= */

function SessionItem({
                         session,
                         active,
                         onSelect,
                         onUpdated,
                         onDeleted,
                     }: {
    session: Session;
    active: boolean;
    onSelect: () => void;
    onUpdated: () => void;
    onDeleted: () => void;
}) {
    const router = useRouter();

    const [openTree, setOpenTree] = useState(false);
    const [openEdit, setOpenEdit] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);

    return (
        <div>
            <button
                onClick={onSelect}
                className={`
          w-full flex items-center gap-2 px-3 py-2 rounded
          ${active ? "bg-accent-soft font-semibold" : "hover:bg-accent-soft"}
        `}
            >
                <FolderOpen size={16} />
                <span className="flex-1 truncate text-left">
          {session.sessionTitle}
        </span>
                <ChevronDown
                    size={14}
                    onClick={(e) => {
                        e.stopPropagation();
                        setOpenTree((v) => !v);
                    }}
                />
            </button>

            {openTree && (
                <div className="ml-6 mt-1 space-y-1 text-sm">
                    <TreeItem
                        icon={StickyNote}
                        label="노트"
                        onClick={() =>
                            router.push(`/workspace/${session.sessionId}/notes`)
                        }
                    />
                    <TreeItem
                        icon={FileText}
                        label="문서"
                        onClick={() =>
                            router.push(`/workspace/${session.sessionId}/documents`)
                        }
                    />

                    <div className="border-t pt-1 mt-1 space-y-1">
                        <button
                            onClick={() => setOpenEdit(true)}
                            className="w-full text-left px-2 py-1 hover:bg-accent-soft rounded"
                        >
                            이름 변경
                        </button>
                        <button
                            onClick={() => setOpenDelete(true)}
                            className="w-full text-left px-2 py-1 text-red-500 hover:bg-red-50 rounded"
                        >
                            삭제
                        </button>
                    </div>
                </div>
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

/* =========================
   UI Helpers
   ========================= */

function NavButton({
                       icon: Icon,
                       label,
                       collapsed,
                       onClick,
                       danger,
                   }: {
    icon: any;
    label: string;
    collapsed: boolean;
    onClick: () => void;
    danger?: boolean;
}) {
    return (
        <button
            onClick={onClick}
            className={`
        w-full flex items-center gap-3 px-3 py-2 rounded
        hover:bg-accent-soft
        ${danger ? "text-red-500 hover:bg-red-50" : ""}
      `}
        >
            <Icon size={18} />
            {!collapsed && label}
        </button>
    );
}

function TreeItem({
                      icon: Icon,
                      label,
                      onClick,
                  }: {
    icon: any;
    label: string;
    onClick: () => void;
}) {
    return (
        <button
            onClick={onClick}
            className="w-full flex items-center gap-2 px-2 py-1 rounded hover:bg-accent-soft"
        >
            <Icon size={14} />
            <span>{label}</span>
        </button>
    );
}
