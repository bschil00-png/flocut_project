"use client";

import {
    FileText,
    Mic,
    File,
    Calendar,
    MoreVertical,
    Trash2,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import Checkbox from "@/app/components/ui/form/Checkbox";
import { useNoteAction } from "@/hooks/notes/useNoteAction";
import { useFileAction } from "@/hooks/files/useFileAction";

type WorkspaceItem = {
    id: string;
    type: "note" | "document" | "audio";
    title: string;
    date: string;
    noteId?: number;
    fileId?: number;
};

type Props = {
    item: WorkspaceItem;
    selected: boolean;
    compact: boolean;
    onToggleSelect: () => void;
    onClick: () => void;
    onDeleted?: () => void;
};

export default function WorkspaceListItem({
                                              item,
                                              selected,
                                              compact,
                                              onToggleSelect,
                                              onClick,
                                              onDeleted,
                                          }: Props) {
    const [showMenu, setShowMenu] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    const { handleSoftDelete } = useNoteAction();
    const { handleDeleteWithConfirm } = useFileAction();

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
                setShowMenu(false);
            }
        };
        if (showMenu) document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, [showMenu]);

    const icon =
        item.type === "audio" ? (
            <Mic size={18} />
        ) : item.type === "document" ? (
            <File size={18} />
        ) : (
            <FileText size={18} />
        );

    return (
        <div
            onClick={onClick}
            className="
                group relative flex items-center gap-3
                px-3 py-2 rounded-lg border
                border-border-light dark:border-border-dark
                hover:bg-accent-soft cursor-pointer
                transition-colors
            "
        >
            {/* 체크박스 */}
            {!compact && (
                <div
                    onClick={(e) => {
                        e.stopPropagation();
                        onToggleSelect();
                    }}
                >
                    <Checkbox label="" checked={selected} onChange={onToggleSelect} />
                </div>
            )}

            {/* 아이콘 */}
            <div className="flex-shrink-0 p-2 rounded-lg bg-surface-light dark:bg-surface-input">
                {icon}
            </div>

            {/* 텍스트 영역 */}
            <div className="flex-1 min-w-0">
                <h3 className="text-sm font-medium truncate text-text-primary-light dark:text-text-primary-dark">
                    {item.title}
                </h3>

                {!compact && (
                    <div className="mt-0.5 flex items-center gap-1.5 text-xs text-text-muted-light dark:text-text-muted-dark">
                        <Calendar size={12} className="flex-shrink-0" />
                        <span className="truncate">{item.date}</span>
                    </div>
                )}
            </div>

            {/* 메뉴 */}
            <div
                ref={menuRef}
                className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
            >
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        setShowMenu((v) => !v);
                    }}
                    className="p-2 rounded-lg hover:bg-surface-light dark:hover:bg-surface-input transition-colors"
                >
                    <MoreVertical size={16} />
                </button>

                {showMenu && (
                    <div className="absolute right-0 top-full mt-1 w-44 bg-white dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-lg shadow-lg z-10">
                        {item.type === "note" ? (
                            // 노트: 휴지통 이동
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    if (item.noteId) {
                                        handleSoftDelete(item.noteId, onDeleted);
                                    }
                                    setShowMenu(false);
                                }}
                                className="w-full px-4 py-2 text-sm text-left flex items-center gap-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                            >
                                <Trash2 size={14} className="flex-shrink-0" />
                                <span>휴지통으로 이동</span>
                            </button>
                        ) : (
                            // 파일/문서: 즉시 삭제
                            // 드롭다운 메뉴
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    if (item.fileId) {
                                        handleDeleteWithConfirm(item.fileId, onDeleted);
                                    }
                                    setShowMenu(false);
                                }}
                            >
                                <Trash2 size={14} />
                                <span>삭제</span>
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}