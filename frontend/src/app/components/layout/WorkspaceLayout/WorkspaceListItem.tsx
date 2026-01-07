"use client";

import {
    FileText,
    Mic,
    File,
    Calendar,
    MoreVertical,
    Trash2,
    Sparkles,
    GitCompare,
} from "lucide-react";
import Checkbox from "@/app/components/ui/form/Checkbox";
import { useState, useRef, useEffect } from "react";
import { useNoteAction } from "@/hooks/notes/useNoteAction";

type WorkspaceItem = {
    id: string;
    type: "note" | "document" | "audio";
    title: string;
    date: string;
    sourceType?: string;
    fileId?: number;
    noteId?: number;
    status?: string;
};

type Props = {
    item: WorkspaceItem;
    sessionId: number;
    selected: boolean;
    onToggleSelect: () => void;
    onClick: () => void;
    onDeleted?: () => void;
};

export default function WorkspaceListItem({
                                              item,
                                              sessionId,
                                              selected,
                                              onToggleSelect,
                                              onClick,
                                              onDeleted,
                                          }: Props) {
    const [showMenu, setShowMenu] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    // REST 액션 훅 (proxy + axios 경유)
    const { handleSoftDelete } = useNoteAction();

    // 메뉴 외부 클릭 감지
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
                setShowMenu(false);
            }
        };

        if (showMenu) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [showMenu]);

    const getIcon = () => {
        switch (item.type) {
            case "audio":
                return <Mic size={18} className="text-accent" />;
            case "document":
                return <File size={18} className="text-accent" />;
            default:
                return <FileText size={18} className="text-accent" />;
        }
    };

    const getTypeLabel = () => {
        switch (item.type) {
            case "audio":
                return "음성";
            case "document":
                return "문서";
            default:
                return "노트";
        }
    };

    const getStatusBadge = () => {
        if (item.status === "PROCESSING") {
            return (
                <span className="px-2 py-0.5 rounded text-xs bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400">
          처리 중
        </span>
            );
        }
        if (item.status === "COMPLETED") {
            return (
                <span className="px-2 py-0.5 rounded text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400">
          완료
        </span>
            );
        }
        if (item.status === "FAILED") {
            return (
                <span className="px-2 py-0.5 rounded text-xs bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400">
          실패
        </span>
            );
        }
        return null;
    };

    const handleCheckboxClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        onToggleSelect();
    };

    const handleMenuClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        setShowMenu(!showMenu);
    };

    // 휴지통 이동
    const handleDelete = async (e: React.MouseEvent) => {
        e.stopPropagation();

        if (!item.noteId) return;

        const confirmed = window.confirm("노트를 휴지통으로 이동하시겠습니까?");
        if (!confirmed) return;

        try {
            await handleSoftDelete(item.noteId, onDeleted);
        } finally {
            setShowMenu(false);
        }
    };

    return (
        <div
            onClick={onClick}
            className={`
        group relative
        flex items-center gap-3 sm:gap-4
        px-3 sm:px-4 py-2 sm:py-3
        rounded-lg
        border
        transition-all cursor-pointer
        ${
                selected
                    ? "border-accent bg-accent-soft shadow-md"
                    : "border-border-light dark:border-border-dark hover:bg-accent-soft hover:border-accent hover:shadow-md"
            }
        bg-white dark:bg-surface-dark
      `}
        >
            {/* 체크박스 */}
            <div onClick={handleCheckboxClick}>
                <Checkbox label="" checked={selected} onChange={onToggleSelect} />
            </div>

            {/* 아이콘 */}
            <div className="p-2 rounded-lg bg-surface-light dark:bg-surface-input flex-shrink-0">
                {getIcon()}
            </div>

            {/* 타입 라벨 */}
            <div className="flex-shrink-0">
        <span className="px-2 py-1 rounded text-xs bg-surface-light dark:bg-surface-input text-text-muted-light dark:text-text-muted-dark">
          {getTypeLabel()}
        </span>
            </div>

            {/* 제목 + 날짜 */}
            <div className="flex-1 min-w-0">
                <h3 className="font-medium text-sm sm:text-base text-text-primary-light dark:text-text-primary-dark truncate mb-1">
                    {item.title}
                </h3>
                <div className="flex items-center gap-2 text-xs text-text-muted-light dark:text-text-muted-dark">
                    <Calendar size={12} />
                    <span>
            {new Date(item.date).toLocaleDateString("ko-KR", {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
            })}
          </span>
                </div>
            </div>

            {/* 상태 배지 */}
            {getStatusBadge()}

            {/* 더보기 메뉴 */}
            <div
                className="relative opacity-0 group-hover:opacity-100 transition-opacity"
                ref={menuRef}
            >
                <button
                    onClick={handleMenuClick}
                    className="p-2 rounded-lg hover:bg-surface-light dark:hover:bg-surface-input transition-colors"
                >
                    <MoreVertical
                        size={16}
                        className="text-text-muted-light dark:text-text-muted-dark"
                    />
                </button>

                {showMenu && (
                    <div className="absolute right-0 top-full mt-1 w-48 bg-white dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-lg shadow-lg z-10 py-1">
                        {item.type === "note" && (
                            <>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setShowMenu(false);
                                    }}
                                    className="w-full px-4 py-2 text-left text-sm flex items-center gap-2 text-text-primary-light dark:text-text-primary-dark hover:bg-accent-soft transition-colors"
                                >
                                    <Sparkles size={14} />
                                    AI 요약
                                </button>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setShowMenu(false);
                                    }}
                                    className="w-full px-4 py-2 text-left text-sm flex items-center gap-2 text-text-primary-light dark:text-text-primary-dark hover:bg-accent-soft transition-colors"
                                >
                                    <GitCompare size={14} />
                                    비교
                                </button>
                                <div className="h-px bg-border-light dark:border-border-dark my-1" />
                            </>
                        )}
                        <button
                            onClick={handleDelete}
                            className="w-full px-4 py-2 text-left text-sm flex items-center gap-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                        >
                            <Trash2 size={14} />
                            휴지통으로 이동
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
