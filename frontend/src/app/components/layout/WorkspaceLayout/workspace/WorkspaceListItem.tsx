// src/app/components/layout/WorkspaceLayout/workspace/WorkspaceListItem.tsx
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
    const [isHighlight, setIsHighlight] = useState(false); //  하이라이트 상태 추가
    const menuRef = useRef<HTMLDivElement>(null);
    const prevTitleRef = useRef(item.title);

    const { handleSoftDelete } = useNoteAction();

    //  제목 변경 감지 시 시각적 효과 부여
    useEffect(() => {
        if (prevTitleRef.current !== item.title) {
            setIsHighlight(true);
            const timer = setTimeout(() => setIsHighlight(false), 1000);
            prevTitleRef.current = item.title;
            return () => clearTimeout(timer);
        }
    }, [item.title]);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
                setShowMenu(false);
            }
        };
        if (showMenu) document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [showMenu]);

    const getIcon = () => {
        switch (item.type) {
            case "audio": return <Mic size={18} className="text-accent" />;
            case "document": return <File size={18} className="text-accent" />;
            default: return <FileText size={18} className="text-accent" />;
        }
    };

    const getTypeLabel = () => {
        switch (item.type) {
            case "audio": return "음성";
            case "document": return "문서";
            default: return "노트";
        }
    };

    const formatDate = (dateString: string) => {
        try {
            if (!dateString) return "날짜 없음";
            const date = new Date(dateString);
            if (isNaN(date.getTime())) return "날짜 오류";

            return date.toLocaleDateString("ko-KR", {
                year: "numeric", month: "long", day: "numeric",
                hour: "2-digit", minute: "2-digit",
            });
        } catch (error) {
            return "날짜 오류";
        }
    };

    const handleDelete = async (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!item.noteId) return;
        if (!window.confirm("노트를 휴지통으로 이동하시겠습니까?")) return;

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
                group relative flex items-center gap-3 sm:gap-4 px-3 sm:px-4 py-2 sm:py-3 rounded-lg border transition-all cursor-pointer
                ${selected ? "border-accent bg-accent-soft shadow-md" : "border-border-light dark:border-border-dark hover:bg-accent-soft hover:border-accent hover:shadow-md"}
                ${isHighlight ? "ring-2 ring-accent ring-inset bg-accent-soft/50" : "bg-white dark:bg-surface-dark"}
            `}
        >
            <div onClick={(e) => { e.stopPropagation(); onToggleSelect(); }}>
                <Checkbox label="" checked={selected} onChange={onToggleSelect} />
            </div>

            <div className="p-2 rounded-lg bg-surface-light dark:bg-surface-input flex-shrink-0">
                {getIcon()}
            </div>

            <div className="flex-shrink-0">
                <span className="px-2 py-1 rounded text-xs bg-surface-light dark:bg-surface-input text-text-muted-light dark:text-text-muted-dark">
                  {getTypeLabel()}
                </span>
            </div>

            <div className="flex-1 min-w-0">
                <h3 className={`font-medium text-sm sm:text-base truncate mb-1 transition-colors ${isHighlight ? "text-accent" : "text-text-primary-light dark:text-text-primary-dark"}`}>
                    {item.title}
                </h3>
                <div className="flex items-center gap-2 text-xs text-text-muted-light dark:text-text-muted-dark">
                    <Calendar size={12} />
                    <span>{formatDate(item.date)}</span>
                </div>
            </div>

            <div className="relative opacity-0 group-hover:opacity-100 transition-opacity" ref={menuRef}>
                <button onClick={(e) => { e.stopPropagation(); setShowMenu(!showMenu); }} className="p-2 rounded-lg hover:bg-surface-light dark:hover:bg-surface-input transition-colors">
                    <MoreVertical size={16} className="text-text-muted-light dark:text-text-muted-dark" />
                </button>

                {showMenu && (
                    <div className="absolute right-0 top-full mt-1 w-48 bg-white dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-lg shadow-lg z-10 py-1">
                        {item.type === "note" && (
                            <>
                                <button className="w-full px-4 py-2 text-left text-sm flex items-center gap-2 text-text-primary-light dark:text-text-primary-dark hover:bg-accent-soft transition-colors">
                                    <Sparkles size={14} /> AI 요약
                                </button>
                                <button className="w-full px-4 py-2 text-left text-sm flex items-center gap-2 text-text-primary-light dark:text-text-primary-dark hover:bg-accent-soft transition-colors">
                                    <GitCompare size={14} /> 비교
                                </button>
                                <div className="h-px bg-border-light dark:border-border-dark my-1" />
                            </>
                        )}
                        <button onClick={handleDelete} className="w-full px-4 py-2 text-left text-sm flex items-center gap-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                            <Trash2 size={14} /> 휴지통으로 이동
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}