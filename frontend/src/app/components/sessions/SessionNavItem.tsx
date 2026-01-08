"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Folder, MoreHorizontal } from "lucide-react";
import { useState, useRef, useEffect } from "react";

import SessionEditModal from "./SessionEditModal";
import SessionDeleteModal from "./SessionDeleteModal";

type Props = {
  sessionId: number;
  title: string;
  active: boolean;
  collapsed: boolean;
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
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [openMenu, setOpenMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  const pathname = usePathname();
  const router = useRouter();

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
      <Link
        href={`/workspace/${sessionId}`}
        className={`
                    flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-colors
                    ${active
          ? "bg-pink-100 dark:bg-pink-900/20 text-pink-600 dark:text-pink-400 font-medium"
          : "text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800"
        }
                    ${collapsed ? "justify-center" : ""}
                `}
      >
        <Folder size={14} />
        {!collapsed && (
          <span className="truncate flex-1">
                        {title}
                    </span>
        )}
      </Link>

      {!collapsed && (
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setOpenMenu((prev) => !prev);
          }}
          className="absolute right-2 top-1/2 -translate-y-1/2 p-1 opacity-0 group-hover:opacity-100 hover:bg-slate-300 dark:hover:bg-slate-700 rounded transition-opacity"
        >
          <MoreHorizontal size={12} />
        </button>
      )}

      {openMenu && (
        <div
          ref={menuRef}
          className="absolute right-2 top-[calc(50%+18px)] w-32 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-lg z-50 overflow-hidden"
        >
          <button
            onClick={() => {
              setOpenMenu(false);
              setOpenEdit(true);
            }}
            className="w-full px-3 py-2 text-sm text-left hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            수정
          </button>

          <button
            onClick={() => {
              setOpenMenu(false);
              setOpenDelete(true);
            }}
            className="w-full px-3 py-2 text-sm text-left text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
          >
            삭제
          </button>
        </div>
      )}

      <SessionEditModal
        open={openEdit}
        onClose={() => setOpenEdit(false)}
        sessionId={sessionId}
        initialTitle={title}
        onUpdated={() => {
          onUpdated();
        }}
      />

      <SessionDeleteModal
        open={openDelete}
        onClose={() => setOpenDelete(false)}
        sessionId={sessionId}
        sessionTitle={title}
        onDeleted={() => {
          onDeleted();

          if (pathname.startsWith(`/workspace/${sessionId}`)) {
            router.replace("/notes");
          }
        }}
      />
    </div>
  );
}