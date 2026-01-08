"use client";

import { useState, Fragment, useMemo, useEffect, useRef, useCallback } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import {
    LayoutGrid,
    List as ListIcon,
    Plus,
    FileText,
    File,
    Search,
    ChevronDown,
    Loader2,
} from "lucide-react";

import { useNotesByStatus } from "@/hooks/notes/useNotesByStatus";
import { useSessionFiles } from "@/hooks/files/useSessionFiles";

import Button from "@/app/components/ui/button/Button";
import Checkbox from "@/app/components/ui/form/Checkbox";
import FileUploadButton from "@/app/components/files/FileUploadButton";

import WorkspaceGridItem from "@/app/components/layout/WorkspaceLayout/WorkspaceGridItem";
import WorkspaceListItem from "@/app/components/layout/WorkspaceLayout/WorkspaceListItem";
import UnifiedPanel from "@/app/components/layout/WorkspaceLayout/panel/UnifiedPanel";
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

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 20;

    const selectedId = searchParams.get("id");
    const selectedType = searchParams.get("type") as "note" | "document" | "audio" | null;

    const { notes, loading: notesLoading, refetch: refetchNotes } = useNotesByStatus(Number(sessionId), "ACTIVE");
    const { files, loading: filesLoading, refetch: refetchFiles } = useSessionFiles(Number(sessionId));

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
            // 패널 최소 너비 400px, 최대 너비는 화면의 80%로 제한하여 본문 보호
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

    const unifiedItems = useMemo(() => {
        const items: any[] = [];
        notes.forEach((note: NoteListItem) => {
            items.push({
                id: `note-${note.noteId}`,
                type: note.sourceType === "AUDIO" ? "audio" : "note",
                title: note.title || "제목 없음",
                date: note.moddate ?? note.regdate ?? "",
                noteId: note.noteId,
                sourceType: note.sourceType ?? undefined,
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

    const paginatedItems = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return unifiedItems.slice(startIndex, startIndex + itemsPerPage);
    }, [unifiedItems, currentPage]);

    const totalPages = Math.ceil(unifiedItems.length / itemsPerPage);
    const loading = notesLoading || filesLoading;

    const isAllSelected = paginatedItems.length > 0 && selectedItems.size === paginatedItems.length;

    const toggleSelectAll = () => {
        setSelectedItems(isAllSelected ? new Set() : new Set(paginatedItems.map((i) => i.id)));
    };

    const toggleSelectItem = (id: string) => {
        setSelectedItems((prev) => {
            const next = new Set(prev);
            next.has(id) ? next.delete(id) : next.add(id);
            return next;
        });
    };

    const handleItemClick = (item: any) => {
        const query = item.noteId ? `type=note&id=${item.noteId}` : `type=document&id=${item.fileId}`;
        router.push(`/workspace/${sessionId}?${query}`, { scroll: false });
    };

    const handleClosePanel = () => router.push(`/workspace/${sessionId}`, { scroll: false });
    const handleNewNote = () => router.push(`/workspace/${sessionId}?type=note&id=new`, { scroll: false });
    const handleStartResize = () => { isDraggingRef.current = true; };

    const handleNoteUpdated = useCallback(() => refetchNotes(), [refetchNotes]);

    return (
        <div className="h-full flex overflow-hidden bg-background-light dark:bg-background-dark relative">
            {/* Main Content Area */}
            <div
                className="flex-1 flex flex-col min-w-[360px] overflow-hidden transition-all duration-300"
                style={{
                    width: selectedId ? `calc(100% - ${panelWidth}px)` : "100%",
                    // 패널이 열렸을 때 본문이 너무 작아지면 찌그러지지 않도록 마진/패딩 조정
                    marginRight: selectedId && typeof window !== 'undefined' && window.innerWidth >= 1024 ? '0' : '0'
                }}
            >
                {/* Header Section */}
                <div className="flex-shrink-0 bg-white dark:bg-surface-dark border-b border-black/[0.05] dark:border-white/[0.05]">
                    <div className="px-4 lg:px-8 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        {/* 탭 필터: 가로 스크롤 보장 */}
                        <div className="flex items-center gap-1 overflow-x-auto scrollbar-hide shrink-0">
                            {(['all', 'notes', 'documents', 'audio'] as const).map((t) => (
                                <button
                                    key={t}
                                    onClick={() => setContentType(t)}
                                    className={`whitespace-nowrap px-4 py-1.5 rounded-lg text-sm font-semibold transition-all shrink-0 ${
                                        contentType === t
                                            ? "bg-accent text-white shadow-sm"
                                            : "text-text-muted-light dark:text-text-muted-dark hover:bg-accent-soft"
                                    }`}
                                >
                                    {t === 'all' ? '전체' : t === 'notes' ? '노트' : t === 'documents' ? '문서' : '음성'}
                                </button>
                            ))}
                        </div>

                        {/* 우측 액션: 검색 및 버튼 */}
                        <div className="flex items-center gap-3 flex-1 justify-end min-w-0">
                            <div className="relative flex-1 max-w-[240px] group shrink">
                                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted-light group-focus-within:text-accent transition-colors" />
                                <input
                                    type="text"
                                    placeholder="검색..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-9 pr-3 py-2 rounded-xl text-sm bg-surface-light dark:bg-surface-input focus:outline-none focus:ring-2 focus:ring-accent-soft transition-all"
                                />
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                                <FileUploadButton sessionId={Number(sessionId)} onUploadComplete={refetchFiles} />
                                <Button variant="primary" size="sm" onClick={handleNewNote} className="rounded-xl shadow-lg shadow-accent/20 whitespace-nowrap">
                                    <Plus size={16} /> <span className="hidden sm:inline">새 노트</span>
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* 일괄 작업바 */}
                    {selectedItems.size > 0 && (
                        <div className="px-4 lg:px-8 py-2 bg-accent-soft flex items-center justify-between animate-fadeIn border-t border-accent/10">
                            <Checkbox checked={isAllSelected} onChange={toggleSelectAll} label={`${selectedItems.size}개 선택됨`} />
                            <div className="flex gap-2">
                                <Button variant="secondary" size="xs" className="whitespace-nowrap">요약</Button>
                                <Button variant="secondary" size="xs" className="whitespace-nowrap">비교</Button>
                                <Button variant="ghost" size="xs" className="text-red-500 hover:bg-red-50 whitespace-nowrap">삭제</Button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Content List: 얇은 스크롤바 */}
                <div className="flex-1 overflow-y-auto px-4 lg:px-8 py-6 custom-scrollbar">
                    {loading ? (
                        <div className="flex items-center justify-center py-20">
                            <Loader2 className="animate-spin text-accent" size={32} />
                        </div>
                    ) : paginatedItems.length === 0 ? (
                        <div className="text-center py-20 bg-surface-light dark:bg-surface-input/50 rounded-3xl mx-4 border border-black/[0.03] dark:border-white/[0.03]">
                            <File size={64} className="mx-auto mb-4 text-text-muted-light opacity-20" />
                            <h3 className="text-xl font-bold text-text-primary-light dark:text-text-primary-dark mb-2">콘텐츠가 없습니다</h3>
                            <p className="text-sm text-text-muted-light mb-8">새 노트를 만들거나 문서를 업로드하여 시작하세요</p>
                            <Button variant="primary" onClick={handleNewNote}><Plus size={20} /> 첫 노트 만들기</Button>
                        </div>
                    ) : (
                        <div className={viewMode === "list" ? "space-y-1" : "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4"}>
                            {paginatedItems.map((item) => (
                                viewMode === "list" ? (
                                    <WorkspaceListItem
                                        key={item.id}
                                        item={item}
                                        sessionId={Number(sessionId)}
                                        selected={selectedItems.has(item.id)}
                                        onToggleSelect={() => toggleSelectItem(item.id)}
                                        onClick={() => handleItemClick(item)}
                                        onDeleted={refetchNotes}
                                    />
                                ) : (
                                    <WorkspaceGridItem
                                        key={item.id}
                                        item={item}
                                        sessionId={Number(sessionId)}
                                        selected={selectedItems.has(item.id)}
                                        onToggleSelect={() => toggleSelectItem(item.id)}
                                        onClick={() => handleItemClick(item)}
                                        onDeleted={refetchNotes}
                                    />
                                )
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Side Panel Section */}
            {selectedId && selectedType && (
                <>
                    {/* Resizer: 데스크탑에서만 표시 */}
                    <div
                        onMouseDown={handleStartResize}
                        className="hidden lg:block w-1 hover:bg-accent cursor-ew-resize transition-colors flex-shrink-0 z-20"
                    />
                    {/* Panel Container: 모바일 오버레이 / 데스크탑 사이드바 분기 */}
                    <div
                        className={`
                            ${typeof window !== 'undefined' && window.innerWidth < 1024
                            ? "fixed inset-0 z-50 bg-white"
                            : "relative bg-white dark:bg-surface-dark border-l border-black/[0.05] dark:border-white/[0.05]"
                        }
                            flex-shrink-0 transition-all overflow-hidden shadow-2xl lg:shadow-none
                        `}
                        style={{ width: typeof window !== 'undefined' && window.innerWidth < 1024 ? '100%' : `${panelWidth}px` }}
                    >
                        <UnifiedPanel
                            type={selectedType}
                            id={selectedId}
                            sessionId={Number(sessionId)}
                            onClose={handleClosePanel}
                            onCreated={(noteId) => {
                                refetchNotes();
                                router.replace(`/workspace/${sessionId}?type=note&id=${noteId}`, { scroll: false });
                            }}
                            onUpdated={handleNoteUpdated}
                        />
                    </div>
                </>
            )}
        </div>
    );
}