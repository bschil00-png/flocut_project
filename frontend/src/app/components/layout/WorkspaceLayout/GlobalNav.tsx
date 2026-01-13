"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
    Home,
    Calendar,
    Plus,
    Settings,
    FolderOpen,
    ChevronDown,
    StickyNote,
    FileText,
    Trash2,
} from "lucide-react";

import CreateSessionModal from "@/app/components/sessions/CreateSessionModal";
import SessionEditModal from "@/app/components/sessions/SessionEditModal";
import SessionDeleteModal from "@/app/components/sessions/SessionDeleteModal";
import { useMySessions } from "@/hooks/sessions/usrMySession";

export type NavMode = "full" | "icon";

interface Session {
    sessionId: number;
    sessionTitle: string;
}

interface Props {
    mode: NavMode;
    selectedSessionId: number | null;
    onSessionSelect: (id: number) => void;
}

export default function GlobalNav({
                                      mode,
                                      selectedSessionId,
                                      onSessionSelect,
                                  }: Props) {
    const router = useRouter();
    const [openCreate, setOpenCreate] = useState(false);

    const { sessions, refetch } = useMySessions();
    const showLabel = mode === "full";

    return (
        <aside
            className={`
        h-full flex-shrink-0
        bg-surface-light dark:bg-surface-dark
        border-r border-border-light dark:border-border-dark
        transition-all duration-300
        ${showLabel ? "w-64" : "w-16"}
      `}
        >
            <nav className="flex flex-col h-full">
                {/* ================= Header ================= */}
                <div className="h-14 flex items-center justify-between px-3 border-b">
                    {showLabel && (
                        <span className="font-bold text-lg truncate">FLOCUT</span>
                    )}

                    <button
                        onClick={() => setOpenCreate(true)}
                        className="p-2 rounded-lg hover:bg-accent-soft"
                        title="새 세션"
                    >
                        <Plus size={18} />
                    </button>
                </div>

                {/* ================= Main ================= */}
                <div className="flex-1 overflow-y-auto p-2 space-y-4">
                    <NavButton
                        icon={Home}
                        label="대시보드"
                        showLabel={showLabel}
                        onClick={() => router.push("/workspace")}
                    />
                    <NavButton
                        icon={Calendar}
                        label="최근 내역"
                        showLabel={showLabel}
                        onClick={() => router.push("/recent")}
                    />

                    {/* ================= Sessions ================= */}
                    <div>
                        {showLabel && (
                            <div className="px-2 mb-2 text-[11px] font-bold opacity-60">
                                프로젝트
                            </div>
                        )}

                        <div className="space-y-1">
                            {sessions.map((session) => (
                                <SessionItem
                                    key={session.sessionId}
                                    session={session}
                                    active={selectedSessionId === session.sessionId}
                                    showLabel={showLabel}
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
                </div>

                {/* ================= Footer ================= */}
                <div className="p-2 border-t space-y-1">
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

/* ================================================================= */
/* ======================= Session Item ============================= */
/* ================================================================= */

function SessionItem({
                         session,
                         active,
                         showLabel,
                         onSelect,
                         onUpdated,
                         onDeleted,
                     }: {
    session: Session;
    active: boolean;
    showLabel: boolean;
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
          w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm
          ${active ? "bg-accent-soft font-semibold" : "hover:bg-accent-soft"}
        `}
            >
                <FolderOpen size={16} />

                {showLabel && (
                    <>
            <span className="flex-1 truncate text-left">
              {session.sessionTitle}
            </span>

                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                setOpenTree((v) => !v);
                            }}
                            className="p-1 rounded hover:bg-black/10"
                        >
                            <ChevronDown
                                size={14}
                                className={`transition-transform ${
                                    openTree ? "rotate-180" : ""
                                }`}
                            />
                        </button>
                    </>
                )}
            </button>

            {/* ================= Tree ================= */}
            {openTree && showLabel && (
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
                            className="w-full text-left px-2 py-1 text-xs hover:bg-accent-soft rounded"
                        >
                            이름 변경
                        </button>
                        <button
                            onClick={() => setOpenDelete(true)}
                            className="w-full text-left px-2 py-1 text-xs text-red-500 hover:bg-red-50 rounded"
                        >
                            삭제
                        </button>
                    </div>
                </div>
            )}

            {/* ================= Modals ================= */}
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

/* ================================================================= */
/* ======================= Shared UI ================================ */
/* ================================================================= */

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
            title={label}
            className={`
        w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm
        ${
                danger
                    ? "text-red-500 hover:bg-red-50"
                    : "hover:bg-accent-soft"
            }
      `}
        >
            <Icon size={18} />
            {showLabel && <span className="truncate">{label}</span>}
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
            className="w-full flex items-center gap-2 px-2 py-1 rounded text-xs hover:bg-accent-soft"
        >
            <Icon size={14} />
            <span>{label}</span>
        </button>
    );
}
