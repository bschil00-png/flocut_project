// app/components/layout/WorkspaceLayout/GlobalNav.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Home,
  Clock,
  Star,
  FileText,
  Folder,
  Plus,
  Settings,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  MoreHorizontal,
  Edit3,
  Trash2,
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
  const [expandedSessions, setExpandedSessions] = useState<Set<number>>(
    new Set()
  );

  const { sessions, refetch } = useSessions();

  const globalNav = [
    { href: "/workspace", label: "홈", icon: Home },
    { href: "/recent", label: "최근 문서", icon: Clock },
    { href: "/favorites", label: "즐겨찾기", icon: Star },
    { href: "/notes", label: "모든 노트", icon: FileText },
  ];

  const toggleSessionExpand = (sessionId: number) => {
    const newExpanded = new Set(expandedSessions);
    if (newExpanded.has(sessionId)) {
      newExpanded.delete(sessionId);
    } else {
      newExpanded.add(sessionId);
    }
    setExpandedSessions(newExpanded);
  };

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
        bg-slate-50 dark:bg-slate-900
        border-r border-slate-200 dark:border-slate-800
        ${collapsed ? "w-16" : "w-64"}
      `}
    >
      <nav className="flex flex-col h-full">
        {/* Header */}
        <div
          className={`
            h-14 flex items-center px-4 border-b border-slate-200 dark:border-slate-800
            ${collapsed ? "justify-center" : "justify-between"}
          `}
        >
          {!collapsed && (
            <span className="font-bold text-lg bg-gradient-to-r from-pink-500 to-violet-500 bg-clip-text text-transparent">
              FLOCUT
            </span>
          )}
          <button
            onClick={onToggle}
            className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg transition-colors"
          >
            {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-3">
          {/* Quick Navigation */}
          <div className="space-y-1 mb-6">
            {globalNav.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.href}
                  onClick={() => router.push(item.href)}
                  className={`
                    w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium
                    transition-colors
                    text-slate-700 dark:text-slate-300
                    hover:bg-slate-100 dark:hover:bg-slate-800
                    ${collapsed ? "justify-center" : ""}
                  `}
                >
                  <Icon size={18} />
                  {!collapsed && <span>{item.label}</span>}
                </button>
              );
            })}
          </div>

          {/* Sessions */}
          <div>
            <div
              className={`
                flex items-center justify-between px-2 mb-2
                ${collapsed ? "justify-center" : ""}
              `}
            >
              {!collapsed ? (
                <>
                  <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                    세션
                  </span>
                  <button
                    onClick={() => setOpenCreate(true)}
                    className="p-1 hover:bg-slate-200 dark:hover:bg-slate-800 rounded transition-colors"
                  >
                    <Plus size={14} />
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setOpenCreate(true)}
                  className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg"
                >
                  <Folder size={18} className="text-slate-400" />
                </button>
              )}
            </div>

            {!collapsed && (
              <div className="space-y-0.5 mb-2">
                {sessions.map((session) => (
                  <SessionItem
                    key={session.sessionId}
                    session={session}
                    isExpanded={expandedSessions.has(session.sessionId)}
                    isSelected={selectedSessionId === session.sessionId}
                    onToggleExpand={() => toggleSessionExpand(session.sessionId)}
                    onSelect={() => onSessionSelect(session.sessionId)}
                    onUpdated={refetch}
                    onDeleted={refetch}
                  />
                ))}
              </div>
            )}

            {/* 휴지통 버튼 */}
            <button
              onClick={handleTrashClick}
              className={`
                w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium
                text-slate-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors
                ${collapsed ? "justify-center" : ""}
              `}
            >
              <Trash2 size={18} />
              {!collapsed && <span>휴지통</span>}
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-slate-200 dark:border-slate-800">
          <button
            className={`
              w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium
              text-slate-700 dark:text-slate-300
              hover:bg-slate-100 dark:hover:bg-slate-800
              transition-colors
              ${collapsed ? "justify-center" : ""}
            `}
          >
            <Settings size={18} />
            {!collapsed && <span>설정</span>}
          </button>
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

// SessionItem 컴포넌트
function SessionItem({
                       session,
                       isExpanded,
                       isSelected,
                       onToggleExpand,
                       onSelect,
                       onUpdated,
                       onDeleted,
                     }: {
  session: any;
  isExpanded: boolean;
  isSelected: boolean;
  onToggleExpand: () => void;
  onSelect: () => void;
  onUpdated: () => void;
  onDeleted: () => void;
}) {
  const router = useRouter();
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const handleSessionClick = () => {
    onSelect();
    router.push(`/workspace/${session.sessionId}`);
  };

  return (
    <div>
      {/* Session Row */}
      <div className="group relative">
        <div
          role="button"
          tabIndex={0}
          onClick={handleSessionClick}
          className={`
            w-full flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm cursor-pointer
            transition-all
            ${
            isSelected
              ? "bg-pink-100 dark:bg-pink-900/20 text-pink-600 dark:text-pink-400 font-medium"
              : "text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800"
          }
          `}
        >
          {/* Expand Toggle */}
          <div
            role="button"
            tabIndex={0}
            onClick={(e) => {
              e.stopPropagation();
              onToggleExpand();
            }}
            className="p-0.5 hover:bg-slate-300 dark:hover:bg-slate-700 rounded transition-colors"
          >
            <ChevronDown
              size={14}
              className={`transition-transform ${
                isExpanded ? "" : "-rotate-90"
              }`}
            />
          </div>

          <Folder size={14} />
          <span className="flex-1 truncate text-left">
            {session.sessionTitle}
          </span>
        </div>

        {/* Actions Menu */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setShowMenu(!showMenu);
          }}
          className="absolute right-2 top-1/2 -translate-y-1/2 p-1
                     opacity-0 group-hover:opacity-100
                     hover:bg-slate-300 dark:hover:bg-slate-700
                     rounded transition-all"
        >
          <MoreHorizontal size={12} />
        </button>

        {showMenu && (
          <div
            className="absolute right-0 top-8 w-32 rounded-lg border
                        border-slate-200 dark:border-slate-800
                        bg-white dark:bg-slate-900 shadow-lg z-50 overflow-hidden"
          >
            <button
              onClick={() => {
                setShowMenu(false);
                setOpenEdit(true);
              }}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm text-left
                         hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <Edit3 size={12} />
              수정
            </button>
            <button
              onClick={() => {
                setShowMenu(false);
                setOpenDelete(true);
              }}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm text-left
                         text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
            >
              <Trash2 size={12} />
              삭제
            </button>
          </div>
        )}
      </div>

      {/* Expanded Sub-items */}
      {isExpanded && (
        <div className="ml-6 mt-1 space-y-0.5">
          <button
            onClick={() => router.push(`/workspace/${session.sessionId}/notes`)}
            className="w-full flex items-center gap-2 px-3 py-1 rounded-lg
                       text-xs text-slate-600 dark:text-slate-400
                       hover:bg-slate-200 dark:hover:bg-slate-800"
          >
            <FileText size={12} />
            노트
          </button>
          <button
            onClick={() =>
              router.push(`/workspace/${session.sessionId}/documents`)
            }
            className="w-full flex items-center gap-2 px-3 py-1 rounded-lg
                       text-xs text-slate-600 dark:text-slate-400
                       hover:bg-slate-200 dark:hover:bg-slate-800"
          >
            <FileText size={12} />
            문서
          </button>
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