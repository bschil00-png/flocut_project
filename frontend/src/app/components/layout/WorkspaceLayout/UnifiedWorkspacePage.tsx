"use client";

import { useState, useMemo, useEffect, useRef, useCallback } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import {
    LayoutGrid,
    List as ListIcon,
    Plus,
    File,
    Search,
    Loader2,
} from "lucide-react";

import { useNotesByStatus } from "@/hooks/notes/useNotesByStatus";
import { useSessionFiles } from "@/hooks/files/useSessionFiles";

import Button from "@/app/components/ui/button/Button";
import Checkbox from "@/app/components/ui/form/Checkbox";
import FileUploadButton from "@/app/components/files/FileUploadButton";

import WorkspaceGridItem from "@/app/components/layout/WorkspaceLayout/workspace/WorkspaceGridItem";
import WorkspaceListItem from "@/app/components/layout/WorkspaceLayout/workspace/WorkspaceListItem";
import UnifiedPanel from "@/app/components/layout/WorkspaceLayout/workspace/panel/UnifiedPanel";
import Pagination from "@/app/components/ui/pagination/Pagination";
import { NoteListItem } from "@/lib/graphql/note/note.type";

type ContentType = "all" | "notes" | "documents" | "audio";
type ViewMode = "grid" | "list";
type SortBy = "recent" | "created" | "title";

export default function UnifiedWorkspacePage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { sessionId } = useParams<{ sessionId: string }>();

    const [contentType, setContentType] = useState<ContentType>("all");
    const [viewMode, setViewMode] = useState<ViewMode>("list");
    const [sortBy, setSortBy] = useState<SortBy>("recent");
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
    const [panelWidth, setPanelWidth] = useState(600);
    const isDraggingRef = useRef(false);

    // 노트 페이지 (0-based)
    const [notePage, setNotePage] = useState(0);
    const pageSize = 20;

    const selectedId = searchParams.get("id");
    const selectedType = searchParams.get("type") as
        | "note"
        | "document"
        | "audio"
        | null;

    // 노트: 서버 페이지네이션
    const {
        page: notePageData,
        notes,
        loading: notesLoading,
        refetch: refetchNotes,
    } = useNotesByStatus(
        Number(sessionId),
        "ACTIVE",
        notePage,
        pageSize
    );

    // 파일: 기존 로직 유지
    const {
        files,
        loading: filesLoading,
        refetch: refetchFiles,
    } = useSessionFiles(Number(sessionId));

    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === "Escape" && selectedId) handleClosePanel();
        };
        window.addEventListener("keydown", handleEsc);
        return () => window.removeEventListener("keydown", handleEsc);
    }, [selectedId]);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (!isDraggingRef.current) return;
            const newWidth = window.innerWidth - e.clientX;
            const maxWidth = window.innerWidth * 0.8;
            setPanelWidth(Math.max(400, Math.min(maxWidth, newWidth)));
        };

        const handleMouseUp = () => {
            isDraggingRef.current = false;
            document.body.style.cursor = "";
            document.body.style.userSelect = "";
        };

        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseup", handleMouseUp);
        return () => {
            document.removeEventListener("mousemove", handleMouseMove);
            document.removeEventListener("mouseup", handleMouseUp);
        };
    }, []);

    // 노트 + 파일 병합 (구조 유지)
    const unifiedItems = useMemo(() => {
        const items: any[] = [];

        notes.forEach((note: NoteListItem) => {
            items.push({
                id: `note-${note.noteId}`,
                type: "note",
                title: note.title || "제목 없음",
                date: note.moddate ?? note.regdate ?? "",
                noteId: note.noteId,
            });
        });

        files.forEach((file) => {
            items.push({
                id: `document-${file.fileId}`,
                type: "document",
                title: file.fileName,
                date: file.regdate ?? "",
                fileId: file.fileId,
                status: file.status,
            });
        });

        let filtered = items;
        if (contentType !== "all") {
            filtered = filtered.filter((item) => {
                if (contentType === "notes") return item.type === "note";
                if (contentType === "documents") return item.type === "document";
                if (contentType === "audio") return item.type === "audio";
                return true;
            });
        }

        if (searchQuery) {
            filtered = filtered.filter((item) =>
                item.title.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        return [...filtered].sort((a, b) => {
            if (sortBy === "title") return a.title.localeCompare(b.title);
            return new Date(b.date).getTime() - new Date(a.date).getTime();
        });
    }, [notes, files, searchQuery, sortBy, contentType]);

    const loading = notesLoading || filesLoading;

    const toggleSelectItem = (id: string) => {
        setSelectedItems((prev) => {
            const next = new Set(prev);
            next.has(id) ? next.delete(id) : next.add(id);
            return next;
        });
    };

    const handleItemClick = (item: any) => {
        const query = item.noteId
            ? `type=note&id=${item.noteId}`
            : `type=document&id=${item.fileId}`;
        router.push(`/workspace/${sessionId}?${query}`, { scroll: false });
    };

    const handleClosePanel = () =>
        router.push(`/workspace/${sessionId}`, { scroll: false });

    const handleNewNote = () =>
        router.push(`/workspace/${sessionId}?type=note&id=new`, {
            scroll: false,
        });

    const handleStartResize = () => {
        isDraggingRef.current = true;
    };

    const handleNoteUpdated = useCallback(
        () => refetchNotes(),
        [refetchNotes]
    );

    return (
        <div className="h-full flex overflow-hidden bg-background-light dark:bg-background-dark relative">
            <div
                className="flex-1 flex flex-col min-w-[360px] overflow-hidden"
                style={{
                    width: selectedId ? `calc(100% - ${panelWidth}px)` : "100%",
                }}
            >
                {/* Header */}
                <div className="bg-white dark:bg-surface-dark border-b">
                    <div className="px-4 lg:px-8 py-4 flex justify-between gap-4">
                        <div className="flex gap-1">
                            {(["all", "notes", "documents", "audio"] as const).map((t) => (
                                <button
                                    key={t}
                                    onClick={() => {
                                        setContentType(t);
                                        setNotePage(0);
                                    }}
                                    className={`px-4 py-1.5 rounded-lg text-sm font-semibold ${
                                        contentType === t
                                            ? "bg-accent text-white"
                                            : "text-text-muted-light hover:bg-accent-soft"
                                    }`}
                                >
                                    {t === "all"
                                        ? "전체"
                                        : t === "notes"
                                            ? "노트"
                                            : t === "documents"
                                                ? "문서"
                                                : "음성"}
                                </button>
                            ))}
                        </div>

                        <div className="flex items-center gap-2">
                            <FileUploadButton
                                sessionId={Number(sessionId)}
                                onUploadComplete={refetchFiles}
                            />
                            <Button size="sm" onClick={handleNewNote}>
                                <Plus size={16} /> 새 노트
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto px-4 lg:px-8 py-6">
                    {loading ? (
                        <div className="flex justify-center py-20">
                            <Loader2 className="animate-spin" size={32} />
                        </div>
                    ) : unifiedItems.length === 0 ? (
                        <div className="text-center py-20">
                            <File size={64} className="mx-auto opacity-20 mb-4" />
                            <p>콘텐츠가 없습니다</p>
                        </div>
                    ) : (
                        <>
                            <div className="space-y-1">
                                {unifiedItems.map((item) => (
                                    <WorkspaceListItem
                                        key={item.id}
                                        item={item}
                                        sessionId={Number(sessionId)}
                                        selected={selectedItems.has(item.id)}
                                        onToggleSelect={() => toggleSelectItem(item.id)}
                                        onClick={() => handleItemClick(item)}
                                        onDeleted={refetchNotes}
                                    />
                                ))}
                            </div>

                            {contentType === "notes" && notePageData && (
                                <Pagination
                                    pageNumber={notePageData.pageNumber}
                                    totalPages={notePageData.totalPages}
                                    hasNext={notePageData.hasNext}
                                    hasPrevious={notePageData.hasPrevious}
                                    isFirst={notePageData.isFirst}
                                    isLast={notePageData.isLast}
                                    onChange={(page) => setNotePage(page)}
                                />
                            )}
                        </>
                    )}
                </div>
            </div>

            {selectedId && selectedType && (
                <>
                    <div
                        onMouseDown={handleStartResize}
                        className="hidden lg:block w-1 hover:bg-accent cursor-ew-resize"
                    />
                    <div
                        className="relative bg-white dark:bg-surface-dark border-l"
                        style={{ width: `${panelWidth}px` }}
                    >
                        <UnifiedPanel
                            type={selectedType}
                            id={selectedId}
                            sessionId={Number(sessionId)}
                            onClose={handleClosePanel}
                            onCreated={(noteId) => {
                                refetchNotes();
                                router.replace(
                                    `/workspace/${sessionId}?type=note&id=${noteId}`,
                                    { scroll: false }
                                );
                            }}
                            onUpdated={handleNoteUpdated}
                        />
                    </div>
                </>
            )}
        </div>
    );
}
