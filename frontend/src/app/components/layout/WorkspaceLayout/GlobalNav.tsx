"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
    Home,
    Calendar,
    Plus,
    Settings,
    ChevronDown,
    ChevronRight,
    Trash2,
    MoreHorizontal,
    FolderOpen,
    ChevronLeft,
    Layers,
} from "lucide-react";

import CreateSessionModal from "@/app/components/sessions/CreateSessionModal";
import SessionEditModal from "@/app/components/sessions/SessionEditModal";
import SessionDeleteModal from "@/app/components/sessions/SessionDeleteModal";
import { useMySessions } from "@/hooks/sessions/useMySession";

export type NavMode = "full" | "icon";

interface Session {
    sessionId: number;
    sessionTitle: string;
}

interface Props {
    mode: NavMode;
    selectedSessionId: number | null;
    onSessionSelect: (id: number) => void;
    onToggle?: () => void;
}

export default function GlobalNav({
                                      mode,
                                      selectedSessionId,
                                      onSessionSelect,
                                      onToggle,
                                  }: Props) {
    const router = useRouter();
    const [openCreate, setOpenCreate] = useState(false);
    const [localSessions, setLocalSessions] = useState<Session[]>([]);
    const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

    const { sessions, refetch } = useMySessions();
    const showLabel = mode === "full";

    /* ===== 무한 렌더링 방지 ===== */
    useEffect(() => {
        if (sessions.length === localSessions.length) {
            const same = sessions.every(
                (s, i) => s.sessionId === localSessions[i]?.sessionId
            );
            if (same) return;
        }
        setLocalSessions(sessions);
    }, [sessions]);

    /* ===== Drag ===== */
    const handleDragStart = (index: number, e: React.DragEvent) => {
        setDraggedIndex(index);

        const img = document.createElement("img");
        img.src =
            "data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=";
        e.dataTransfer.setDragImage(img, 0, 0);
    };

    const handleDragOver = (e: React.DragEvent, index: number) => {
        e.preventDefault();
        if (draggedIndex === null || draggedIndex === index) return;

        const next = [...localSessions];
        const dragged = next[draggedIndex];
        next.splice(draggedIndex, 1);
        next.splice(index, 0, dragged);

        setLocalSessions(next);
        setDraggedIndex(index);
    };

    const handleDragEnd = () => setDraggedIndex(null);

    return (
        <aside
            className={`
                h-full flex-shrink-0
                bg-surface-light dark:bg-surface-dark
                border-r border-border-light dark:border-border-dark
                transition-all duration-300
                ${showLabel ? "w-64" : "w-16"}
                relative
            `}
        >
            <nav className="flex flex-col h-full overflow-hidden">
                {/* Header */}
                <div className="h-14 flex items-center justify-between px-3 border-b border-border-light dark:border-border-dark">
                    {showLabel && (
                        <span className="font-bold text-lg truncate text-accent">
                            FLOCUT
                        </span>
                    )}

                    {onToggle && (
                        <button
                            onClick={onToggle}
                            className="p-2 rounded-lg hover:bg-accent-soft"
                        >
                            <ChevronLeft
                                size={18}
                                className={`transition-transform ${
                                    showLabel ? "" : "rotate-180"
                                }`}
                            />
                        </button>
                    )}
                </div>

                {/* Scroll */}
                <div className="flex-1 overflow-y-auto thin-scrollbar">
                    <div className="p-2 space-y-4">
                        <div className="space-y-1">
                            <NavButton
                                icon={Home}
                                label="대시보드"
                                showLabel={showLabel}
                                onClick={() => router.push("/workspace")}
                            />
                            <NavButton
                                icon={Calendar}
                                label="캘린더"
                                showLabel={showLabel}
                                onClick={() => router.push("/calendar")}
                            />
                            <NavButton
                                icon={Home}
                                label="내 프로젝트"
                                showLabel={showLabel}
                                onClick={() => router.push("/workspace/sessions")}
                            />
                        </div>

                        {showLabel ? (
                            <button
                                onClick={() => setOpenCreate(true)}
                                className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm
                                           bg-accent text-white hover:bg-accent-hover"
                            >
                                <Plus size={16} />
                                새 프로젝트
                            </button>
                        ) : (
                            <button
                                onClick={() => setOpenCreate(true)}
                                className="w-full flex justify-center p-2 rounded-lg
                                           bg-accent text-white hover:bg-accent-hover"
                            >
                                <Plus size={18} />
                            </button>
                        )}

                        {showLabel && (
                            <div className="pt-2 px-3 text-[11px] font-bold text-text-muted-light dark:text-text-muted-dark">
                                프로젝트
                            </div>
                        )}

                        <div className="space-y-1">
                            {localSessions.map((session, index) => (
                                <SessionItem
                                    key={session.sessionId}
                                    session={session}
                                    index={index}
                                    active={selectedSessionId === session.sessionId}
                                    showLabel={showLabel}
                                    onSelect={() => {
                                        onSessionSelect(session.sessionId);
                                        router.push(`/workspace/${session.sessionId}`);
                                    }}
                                    onUpdated={refetch}
                                    onDeleted={refetch}
                                    onDragStart={handleDragStart}
                                    onDragOver={handleDragOver}
                                    onDragEnd={handleDragEnd}
                                />
                            ))}
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-2 border-t border-border-light dark:border-border-dark space-y-1">
                    <NavButton
                        icon={Trash2}
                        label="휴지통"
                        showLabel={showLabel}
                        danger
                        onClick={() => router.push("/trash")}
                    />
                    <NavButton
                        icon={Settings}
                        label="설정"
                        showLabel={showLabel}
                        onClick={() => router.push("/settings/profile")}
                    />
                </div>
            </nav>

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

/* ======================= Session Item ============================ */

function SessionItem({
                         session,
                         index,
                         active,
                         showLabel,
                         onSelect,
                         onUpdated,
                         onDeleted,
                         onDragStart,
                         onDragOver,
                         onDragEnd,
                     }: {
    session: Session;
    index: number;
    active: boolean;
    showLabel: boolean;
    onSelect: () => void;
    onUpdated: () => void;
    onDeleted: () => void;
    onDragStart: (index: number, e: React.DragEvent) => void;
    onDragOver: (e: React.DragEvent, index: number) => void;
    onDragEnd: () => void;
}) {
    const router = useRouter();
    const [expanded, setExpanded] = useState(false);
    const [showMenu, setShowMenu] = useState(false);
    const [openEdit, setOpenEdit] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);

    const [showTooltip, setShowTooltip] = useState(false);
    const [isTruncated, setIsTruncated] = useState(false);

    const titleRef = useRef<HTMLSpanElement>(null);
    const menuButtonRef = useRef<HTMLButtonElement>(null);
    const [menuStyle, setMenuStyle] = useState<React.CSSProperties>({});

    /* 제목 잘림 체크 */
    useEffect(() => {
        if (!titleRef.current) return;
        setIsTruncated(
            titleRef.current.scrollWidth > titleRef.current.clientWidth
        );
    }, [session.sessionTitle, showLabel]);

    /* 드롭다운 위치 (FIXED) */
    useEffect(() => {
        if (!showMenu || !menuButtonRef.current) return;

        const rect = menuButtonRef.current.getBoundingClientRect();
        const menuHeight = 120;

        const position =
            window.innerHeight - rect.bottom < menuHeight && rect.top > menuHeight
                ? "top"
                : "bottom";

        setMenuStyle({
            position: "fixed",
            top: position === "bottom" ? rect.bottom + 6 : undefined,
            bottom:
                position === "top"
                    ? window.innerHeight - rect.top + 6
                    : undefined,
            right: window.innerWidth - rect.right,
            zIndex: 9999,
        });
    }, [showMenu]);

    return (
        <div
            draggable={showLabel}
            onDragStart={(e) => onDragStart(index, e)}
            onDragOver={(e) => onDragOver(e, index)}
            onDragEnd={onDragEnd}
        >
            <div
                className={`
                    group flex items-center gap-2 px-3 py-2 rounded-lg text-sm
                    ${showLabel ? "cursor-grab active:cursor-grabbing" : ""}
                    ${
                    active
                        ? "bg-accent-soft font-medium text-accent"
                        : "hover:bg-accent-soft"
                }
                `}
            >
                {showLabel && (
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            setExpanded(!expanded);
                        }}
                        className="p-0.5 rounded hover:bg-black/10 dark:hover:bg-white/10"
                    >
                        {expanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                    </button>
                )}

                <button
                    onClick={onSelect}
                    className="relative flex items-center gap-2 flex-1 min-w-0"
                    onMouseEnter={() => setShowTooltip(true)}
                    onMouseLeave={() => setShowTooltip(false)}
                >
                    <FolderOpen size={18} className="flex-shrink-0" />
                    {showLabel && (
                        <>
                            <span ref={titleRef} className="truncate">
                                {session.sessionTitle}
                            </span>

                            {showTooltip && isTruncated && (
                                <div
                                    className="
                                        absolute left-0 top-full mt-1 z-50
                                        px-2 py-1 rounded
                                        bg-surface-light dark:bg-surface-dark
                                        text-text-primary-light dark:text-text-primary-dark
                                        border border-border-light dark:border-border-dark
                                        text-xs whitespace-nowrap shadow-lg
                                    "
                                >
                                    {session.sessionTitle}
                                </div>
                            )}
                        </>
                    )}
                </button>

                {showLabel && (
                    <button
                        ref={menuButtonRef}
                        onClick={(e) => {
                            e.stopPropagation();
                            setShowMenu(!showMenu);
                        }}
                        className="p-1 rounded hover:bg-black/10 dark:hover:bg-white/10
                                   opacity-0 group-hover:opacity-100"
                    >
                        <MoreHorizontal size={16} />
                    </button>
                )}
            </div>

            {showMenu && (
                <>
                    <div
                        className="fixed inset-0 z-[9998]"
                        onClick={() => setShowMenu(false)}
                    />
                    <div
                        style={menuStyle}
                        className="
                            min-w-[140px] py-1 rounded-lg shadow-xl
                            bg-surface-light dark:bg-surface-dark
                            border border-border-light dark:border-border-dark
                        "
                    >
                        <button
                            onClick={() => {
                                setOpenEdit(true);
                                setShowMenu(false);
                            }}
                            className="w-full px-4 py-2 text-left text-sm hover:bg-accent-soft"
                        >
                            이름 변경
                        </button>
                        <div className="h-px bg-border-light dark:bg-border-dark my-1" />
                        <button
                            onClick={() => {
                                setOpenDelete(true);
                                setShowMenu(false);
                            }}
                            className="w-full px-4 py-2 text-left text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                        >
                            삭제
                        </button>
                    </div>
                </>
            )}

            {expanded && showLabel && (
                <div className="ml-6 mt-1 space-y-1">
                    <SubMenuItem
                        icon={Layers}
                        label="전체보기"
                        onClick={() =>
                            router.push(`/workspace/${session.sessionId}`)
                        }
                    />
                    <SubMenuItem
                        icon={Trash2}
                        label="휴지통"
                        danger
                        onClick={() =>
                            router.push(`/workspace/${session.sessionId}/trash`)
                        }
                    />
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

/* ======================= Shared UI =============================== */

function NavButton({
                       icon: Icon,
                       label,
                       showLabel,
                       onClick,
                       danger,
                   }: {
    icon: any;
    label: string;
    showLabel: boolean;
    onClick: () => void;
    danger?: boolean;
}) {
    return (
        <button
            onClick={onClick}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm
                ${
                danger
                    ? "text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                    : "hover:bg-accent-soft"
            }
                ${!showLabel ? "justify-center" : ""}`}
        >
            <Icon size={18} className="flex-shrink-0" />
            {showLabel && <span className="truncate">{label}</span>}
        </button>
    );
}

function SubMenuItem({
                         icon: Icon,
                         label,
                         onClick,
                         danger,
                     }: {
    icon: any;
    label: string;
    onClick: () => void;
    danger?: boolean;
}) {
    return (
        <button
            onClick={onClick}
            className={`w-full flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs
                ${
                danger
                    ? "text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                    : "hover:bg-accent-soft"
            }`}
        >
            <Icon size={14} className="flex-shrink-0" />
            <span className="truncate">{label}</span>
        </button>
    );
}
