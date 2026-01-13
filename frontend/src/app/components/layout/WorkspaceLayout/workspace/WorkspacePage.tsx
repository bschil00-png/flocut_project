"use client";

import { useParams } from "next/navigation";
import { useMemo, useState, useCallback, useEffect } from "react";

import ResizablePanelLayout from "../ResizablePanelLayout";
import WorkspaceContent from "./WorkspaceContent";
import WorkspacePanel from "./WorkspacePanel";
import WorkspaceHeaderBar from "./WorkspaceHeaderBar";

import { useWorkspaceQuery } from "@/hooks/workspace/useWorkspaceQuery";
import { useWorkspaceRouting } from "@/hooks/workspace/useWorkspaceRouting";
import { useWorkspaceSelection } from "@/hooks/workspace/useWorkspaceSelection";
import {
    WorkspaceItem,
    WorkspaceFilter,
    SortBy,
    ViewMode,
} from "@/hooks/workspace/workspace";

export default function WorkspacePage() {
    const { sessionId } = useParams<{ sessionId: string }>();

    const [filter, setFilter] = useState<WorkspaceFilter>("all");
    const [searchQuery, setSearchQuery] = useState("");
    const [sortBy, setSortBy] = useState<SortBy>("recent");
    const [viewMode, setViewMode] = useState<ViewMode>("list");
    const [clientPage, setClientPage] = useState(0);

    const {
        allNotes,
        files,
        loading,
        refetchNotes,
        refetchFiles,
        forceRefetch,
    } = useWorkspaceQuery(sortBy);

    const {
        selectedItems,
        toggleSelectItem,
        clearSelection,
    } = useWorkspaceSelection();

    const {
        selectedId,
        selectedType,
        openItem,
        closePanel,
        openNewNote,
    } = useWorkspaceRouting();

    // 전체 아이템 목록
    const allItems: WorkspaceItem[] = useMemo(() => {
        const merged: WorkspaceItem[] = [
            ...allNotes.map((n) => ({
                id: `note-${n.noteId}`,
                type: "note" as const,
                title: n.title ?? "제목 없음",
                date: n.moddate ?? n.regdate ?? "",
                regdate: n.regdate ?? "",
                moddate: n.moddate ?? "",
                noteId: n.noteId,
            })),
            ...files.map((f) => ({
                id: `document-${f.fileId}`,
                type: "document" as const,
                title: f.fileName,
                date: f.regdate ?? "",
                regdate: f.regdate ?? "",
                moddate: f.regdate ?? "",
                fileId: f.fileId,
            })),
        ];

        const filtered =
            filter === "all"
                ? merged
                : merged.filter((i) => i.type === filter);

        const searched = searchQuery.trim()
            ? filtered.filter((item) =>
                item.title
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase().trim())
            )
            : filtered;

        const sorted = [...searched].sort((a, b) => {
            if (sortBy === "title") {
                return a.title.localeCompare(b.title, "ko-KR");
            }

            if (sortBy === "created") {
                const dateA = new Date(a.regdate || a.date).getTime();
                const dateB = new Date(b.regdate || b.date).getTime();
                return dateB - dateA;
            }

            const dateA = new Date(a.moddate || a.regdate || a.date).getTime();
            const dateB = new Date(b.moddate || b.regdate || b.date).getTime();
            return dateB - dateA;
        });

        return sorted;
    }, [allNotes, files, filter, searchQuery, sortBy]);

    const pageSize = 20;
    const totalPages = Math.ceil(allItems.length / pageSize);
    const startIdx = clientPage * pageSize;
    const pagedItems = allItems.slice(startIdx, startIdx + pageSize);

    const pageData = {
        pageNumber: clientPage,
        totalPages,
        totalElements: allItems.length,
        hasNext: clientPage < totalPages - 1,
        hasPrevious: clientPage > 0,
        isFirst: clientPage === 0,
        isLast: clientPage === totalPages - 1,
    };

    useEffect(() => {
        setClientPage(0);
    }, [sortBy, filter, searchQuery]);

    const handleNoteCreated = useCallback(
        async (noteId: number) => {
            await forceRefetch();
            setClientPage(0);
        },
        [forceRefetch]
    );

    const handleNoteUpdated = useCallback(
        async () => {
            await refetchNotes();
        },
        [refetchNotes]
    );

    const handleSelectAll = useCallback(() => {
        const allItemIds = pagedItems.map((item) => item.id);
        allItemIds.forEach((id) => {
            if (!selectedItems.has(id)) {
                toggleSelectItem(id);
            }
        });
    }, [pagedItems, selectedItems, toggleSelectItem]);

    // 대량 삭제 완료 핸들러
    const handleBulkDeleteComplete = useCallback(async () => {
        await Promise.all([refetchNotes(), refetchFiles()]);
    }, [refetchNotes, refetchFiles]);

    return (
        <ResizablePanelLayout
            isOpen={!!selectedId}
            left={(isCompact) => (
                <div className="flex flex-col h-full min-h-0">
                    <WorkspaceHeaderBar
                        filter={filter}
                        onChangeFilter={setFilter}
                        selectedCount={selectedItems.size}
                        onClearSelection={clearSelection}
                        onSelectAll={handleSelectAll}
                        totalItems={pagedItems.length}
                        sessionId={Number(sessionId)}
                        onUploaded={refetchFiles}
                        onNewNote={openNewNote}
                        searchQuery={searchQuery}
                        onSearchChange={setSearchQuery}
                        sortBy={sortBy}
                        onSortChange={setSortBy}
                        viewMode={viewMode}
                        onViewModeChange={setViewMode}
                        allItems={allItems}
                        selectedItems={selectedItems}
                        onBulkDeleteComplete={handleBulkDeleteComplete}
                    />

                    <WorkspaceContent
                        compact={isCompact}
                        loading={loading}
                        items={pagedItems}
                        selectedItems={selectedItems}
                        onToggleSelect={toggleSelectItem}
                        onItemClick={(item) =>
                            openItem(item.type, item.noteId ?? item.fileId!)
                        }
                        notePageData={pageData}
                        onPageChange={setClientPage}
                        onDeleted={handleNoteUpdated}
                        viewMode={viewMode}
                    />
                </div>
            )}
            right={
                <WorkspacePanel
                    selectedId={selectedId}
                    selectedType={selectedType}
                    onClose={closePanel}
                    onCreated={handleNoteCreated}
                    onUpdated={handleNoteUpdated}
                />
            }
        />
    );
}