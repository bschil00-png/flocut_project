"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Folder, MoreHorizontal } from "lucide-react";
import { useState, useRef, useEffect } from "react";

import IconButton from "@/app/components/ui/icon-button/IconButton";
import SessionEditModal from "./SessionEditModal";
import SessionDeleteModal from "./SessionDeleteModal";

// SessionNavItem이 받을 props 정의
// GlobalNav는 여기로 데이터와 콜백만 내려준다
type Props = {
    sessionId: number;     // 세션 PK
    title: string;         // 세션 제목
    active: boolean;       // 현재 선택된 세션인지 여부
    collapsed: boolean;    // GlobalNav 접힘 상태
    onUpdated: () => void; // 세션 수정 후 목록 갱신용 콜백
    onDeleted: () => void; // 세션 삭제 후 목록 갱신용 콜백
};

export default function SessionNavItem({
                                           sessionId,
                                           title,
                                           active,
                                           collapsed,
                                           onUpdated,
                                           onDeleted,
                                       }: Props) {
    // 수정 모달 열림 상태
    const [openEdit, setOpenEdit] = useState(false);

    // 삭제 모달 열림 상태
    const [openDelete, setOpenDelete] = useState(false);

    // ⋯ 액션 메뉴 열림 상태
    const [openMenu, setOpenMenu] = useState(false);

    // 메뉴 DOM 참조 (외부 클릭 감지용)
    const menuRef = useRef<HTMLDivElement | null>(null);

    const pathname = usePathname();
    const router = useRouter();

    // 메뉴 바깥을 클릭하면 메뉴 닫기
    useEffect(() => {
        if (!openMenu) return;

        function handleOutsideClick(e: MouseEvent) {
            if (
                menuRef.current &&
                !menuRef.current.contains(e.target as Node)
            ) {
                setOpenMenu(false);
            }
        }

        document.addEventListener("mousedown", handleOutsideClick);
        return () => {
            document.removeEventListener("mousedown", handleOutsideClick);
        };
    }, [openMenu]);

    return (
        <div className="group relative">
            {/* 세션 이동 링크 */}
            <Link
                href={`/workspace/${sessionId}`}
                className={`
                    flex items-center gap-3 px-3 py-2 rounded-md text-sm
                    ${active ? "bg-accent-soft text-accent" : "hover:bg-accent-soft"}
                    ${collapsed ? "justify-center" : ""}
                `}
            >
                {/* 세션은 항상 폴더 아이콘 */}
                <Folder size={16} />

                {/* 접힌 상태에서는 텍스트 숨김 */}
                {!collapsed && (
                    <span className="truncate flex-1">
                        {title}
                    </span>
                )}
            </Link>

            {/* ⋯ 버튼 (hover 시에만 노출) */}
            {!collapsed && (
                <IconButton
                    icon={<MoreHorizontal size={14} />}
                    onClick={(e) => {
                        // Link 클릭 방지
                        e.preventDefault();
                        e.stopPropagation();

                        setOpenMenu((prev) => !prev);
                    }}
                    className="
                        absolute right-2 top-1/2 -translate-y-1/2
                        opacity-0 group-hover:opacity-100
                    "
                />
            )}

            {/* 액션 메뉴 (수정 / 삭제) */}
            {openMenu && (
                <div
                    ref={menuRef}
                    className="
                        absolute right-2 top-[calc(50%+18px)]
                        w-28 rounded-md border
                        bg-surface-light
                        shadow-md
                        z-50
                    "
                >
                    {/* 수정 버튼 */}
                    <button
                        onClick={() => {
                            setOpenMenu(false);
                            setOpenEdit(true);
                        }}
                        className="
                            w-full px-3 py-2 text-sm text-left
                            hover:bg-accent-soft
                        "
                    >
                        수정
                    </button>

                    {/* 삭제 버튼 */}
                    <button
                        onClick={() => {
                            setOpenMenu(false);
                            setOpenDelete(true);
                        }}
                        className="
                            w-full px-3 py-2 text-sm text-left
                            text-red-500
                            hover:bg-red-50
                        "
                    >
                        삭제
                    </button>
                </div>
            )}

            {/* 세션 수정 모달 */}
            <SessionEditModal
                open={openEdit}
                onClose={() => setOpenEdit(false)}
                sessionId={sessionId}
                initialTitle={title}
                onUpdated={() => {
                    // 수정 후 목록 재조회
                    onUpdated();
                }}
            />

            {/* 세션 삭제 모달 */}
            <SessionDeleteModal
                open={openDelete}
                onClose={() => setOpenDelete(false)}
                sessionId={sessionId}
                sessionTitle={title}
                onDeleted={() => {
                    // 삭제 후 목록 재조회
                    onDeleted();

                    // 현재 보고 있는 세션을 삭제한 경우
                    if (pathname.startsWith(`/workspace/${sessionId}`)) {
                        router.replace("/notes");
                    }
                }}
            />
        </div>
    );
}
