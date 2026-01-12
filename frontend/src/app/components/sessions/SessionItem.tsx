"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
    Folder,
    MoreHorizontal,
    ChevronDown,
    ChevronRight,
    FileText,
    File,
    Trash2,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";

import SessionEditModal from "./SessionEditModal";
import SessionDeleteModal from "./SessionDeleteModal";

type Props = {
    sessionId: number;
    title: string;
    active: boolean;      // 현재 선택된 세션 여부
    collapsed: boolean;   // GlobalNav 접힘 여부
    onUpdated: () => void;
    onDeleted: () => void;
};

export default function SessionNavItem({
                                           sessionId,
                                           title,
                                           active,
                                           collapsed,
                                           onUpdated,
                                           onDeleted,
                                       }: Props) {
    // 수정 / 삭제 모달 상태
    const [openEdit, setOpenEdit] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);

    // 우측 점(...) 메뉴 상태
    const [openMenu, setOpenMenu] = useState(false);

    // ✅ 세션 하위(노트/문서/휴지통) 펼침 상태
    // 현재 활성 세션이면 기본적으로 열리게
    const [openChildren, setOpenChildren] = useState(active);

    const menuRef = useRef<HTMLDivElement | null>(null);

    const pathname = usePathname();
    const router = useRouter();

    // 우측 메뉴 바깥 클릭 시 닫기
    useEffect(() => {
        if (!openMenu) return;

        function handleOutsideClick(e: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
                setOpenMenu(false);
            }
        }

        document.addEventListener("mousedown", handleOutsideClick);
        return () => document.removeEventListener("mousedown", handleOutsideClick);
    }, [openMenu]);

    return (
        <div className="group relative">
            {/* ===================== */}
            {/* 세션 헤더 (폴더 라인) */}
            {/* ===================== */}
            <div
                className={`
          flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm
          transition-colors cursor-pointer
          ${active
                    ? "bg-pink-100 dark:bg-pink-900/20 text-pink-600 dark:text-pink-400 font-medium"
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800"
                }
          ${collapsed ? "justify-center" : ""}
        `}
                // 세션 클릭 시: 세션 기본 페이지로 이동
                onClick={() => {
                    router.push(`/workspace/${sessionId}`);
                    setOpenChildren(true); // 세션 클릭하면 하위도 열어줌
                }}
            >
                <Folder size={14} />

                {/* 접힘 상태가 아닐 때만 제목 표시 */}
                {!collapsed && (
                    <span className="truncate flex-1">{title}</span>
                )}

                {/* 펼침 / 접힘 토글 버튼 */}
                {!collapsed && (
                    <button
                        onClick={(e) => {
                            e.stopPropagation(); // 세션 이동 막기
                            setOpenChildren((prev) => !prev);
                        }}
                        className="p-0.5 rounded hover:bg-black/10 dark:hover:bg-white/10"
                    >
                        {openChildren ? (
                            <ChevronDown size={14} />
                        ) : (
                            <ChevronRight size={14} />
                        )}
                    </button>
                )}
            </div>

            {/* ===================== */}
            {/* 우측 ... 메뉴 버튼 */}
            {/* ===================== */}
            {!collapsed && (
                <button
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setOpenMenu((prev) => !prev);
                    }}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1
                     opacity-0 group-hover:opacity-100
                     hover:bg-slate-300 dark:hover:bg-slate-700
                     rounded transition-opacity"
                >
                    <MoreHorizontal size={12} />
                </button>
            )}

            {/* ===================== */}
            {/* 우측 ... 드롭다운 */}
            {/* ===================== */}
            {openMenu && (
                <div
                    ref={menuRef}
                    className="absolute right-2 top-[calc(50%+18px)]
                     w-32 rounded-lg border
                     border-slate-200 dark:border-slate-800
                     bg-white dark:bg-slate-900
                     shadow-lg z-50 overflow-hidden"
                >
                    <button
                        onClick={() => {
                            setOpenMenu(false);
                            setOpenEdit(true);
                        }}
                        className="w-full px-3 py-2 text-sm text-left
                       hover:bg-slate-100 dark:hover:bg-slate-800"
                    >
                        수정
                    </button>

                    <button
                        onClick={() => {
                            setOpenMenu(false);
                            setOpenDelete(true);
                        }}
                        className="w-full px-3 py-2 text-sm text-left
                       text-red-500 hover:bg-red-50
                       dark:hover:bg-red-900/20"
                    >
                        삭제
                    </button>
                </div>
            )}

            {/* ===================== */}
            {/* 세션 하위 네비 (노션 스타일) */}
            {/* ===================== */}
            {openChildren && !collapsed && (
                <div className="ml-6 mt-1 space-y-0.5">
                    {/* 노트 */}
                    <NavChild
                        icon={<FileText size={12} />}
                        label="노트"
                        active={pathname.startsWith(`/workspace/${sessionId}/notes`)}
                        onClick={() =>
                            router.push(`/workspace/${sessionId}/notes`)
                        }
                    />

                    {/* 문서 */}
                    <NavChild
                        icon={<File size={12} />}
                        label="문서"
                        active={pathname.startsWith(`/workspace/${sessionId}/documents`)}
                        onClick={() =>
                            router.push(`/workspace/${sessionId}/documents`)
                        }
                    />

                    {/* 휴지통 */}
                    <NavChild
                        icon={<Trash2 size={12} />}
                        label="휴지통"
                        active={pathname.startsWith(`/workspace/${sessionId}/trash`)}
                        onClick={() =>
                            router.push(`/workspace/${sessionId}/trash`)
                        }
                    />
                </div>
            )}

            {/* ===================== */}
            {/* 수정 / 삭제 모달 */}
            {/* ===================== */}
            <SessionEditModal
                open={openEdit}
                onClose={() => setOpenEdit(false)}
                sessionId={sessionId}
                initialTitle={title}
                onUpdated={onUpdated}
            />

            <SessionDeleteModal
                open={openDelete}
                onClose={() => setOpenDelete(false)}
                sessionId={sessionId}
                sessionTitle={title}
                onDeleted={() => {
                    onDeleted();

                    // 현재 세션 화면에 있으면 안전한 곳으로 이동
                    if (pathname.startsWith(`/workspace/${sessionId}`)) {
                        router.replace("/workspace");
                    }
                }}
            />
        </div>
    );
}

/* ========================= */
/* 하위 네비 버튼 컴포넌트 */
/* ========================= */
function NavChild({
                      icon,
                      label,
                      active,
                      onClick,
                  }: {
    icon: React.ReactNode;
    label: string;
    active: boolean;
    onClick: () => void;
}) {
    return (
        <button
            onClick={onClick}
            className={`
        w-full flex items-center gap-2
        px-3 py-1.5 text-xs rounded
        transition-colors
        ${active
                ? "bg-accent-soft text-accent font-medium"
                : "text-slate-500 hover:text-accent hover:bg-accent-soft"
            }
      `}
        >
            {icon}
            <span>{label}</span>
        </button>
    );
}
