"use client";

import { useParams } from "next/navigation";
import { useMemo, useState, useEffect } from "react";

import ResizablePanelLayout from "../ResizablePanelLayout";
import WorkspaceHeaderBar from "./WorkspaceHeaderBar";
import WorkspaceContent from "./WorkspaceContent";
import WorkspacePanel from "./WorkspacePanel";

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
  const [page, setPage] = useState(0);

  const { allNotes, allFiles, loading, forceRefetch } = useWorkspaceQuery(sortBy);
  const { selectedItems, toggleSelectItem, clearSelection } = useWorkspaceSelection();
  const { selectedId, selectedType, openItem, closePanel, openNewNote } = useWorkspaceRouting();

  //  전체 아이템 병합 및 필터링/정렬 로직
  const allItems: WorkspaceItem[] = useMemo(() => {
    const merged = [...allNotes, ...allFiles];
    const filtered = filter === "all" ? merged : merged.filter((i) => i.type === filter);
    const searched = searchQuery ? filtered.filter((i) => i.title.toLowerCase().includes(searchQuery.toLowerCase())) : filtered;

    return [...searched].sort((a, b) => {
      if (sortBy === "title") return a.title.localeCompare(b.title, "ko-KR");
      if (sortBy === "created") return new Date(b.regdate || "").getTime() - new Date(a.regdate || "").getTime();
      return new Date(b.moddate || "").getTime() - new Date(a.moddate || "").getTime();
    });
  }, [allNotes, allFiles, filter, searchQuery, sortBy]);


  const selectedItemTitle = useMemo(() => {
    if (!selectedId) return undefined;

    const item = allItems.find(i => {

      const nid = i.noteId?.toString();
      const fid = i.fileId?.toString();
      const sid = selectedId.toString();

      return nid === sid || fid === sid;
    });

    return item?.title;
  }, [selectedId, allItems]);

  const pageSize = 20;
  const totalPages = Math.ceil(allItems.length / pageSize);
  const pagedItems = useMemo(() => {
    const start = page * pageSize;
    return allItems.slice(start, start + pageSize);
  }, [allItems, page]);

  useEffect(() => { setPage(0); }, [filter, searchQuery, sortBy]);

  const pageData = {
    pageNumber: page,
    totalPages,
    totalElements: allItems.length,
    hasNext: page < totalPages - 1,
    hasPrevious: page > 0,
    isFirst: page === 0,
    isLast: page === totalPages - 1,
  };

  return (
    <ResizablePanelLayout
      isOpen={!!selectedId}
      left={(compact) => (
        <div className="flex flex-col h-full min-h-0">
          <WorkspaceHeaderBar
            filter={filter}
            onChangeFilter={setFilter}
            selectedCount={selectedItems.size}
            onClearSelection={clearSelection}
            onSelectAll={() => pagedItems.forEach((i) => toggleSelectItem(i.id))}
            totalItems={pagedItems.length}
            sessionId={Number(sessionId)}
            onUploaded={forceRefetch}
            onNewNote={openNewNote}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            sortBy={sortBy}
            onSortChange={setSortBy}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            allItems={allItems}
            selectedItems={selectedItems}
            onBulkDeleteComplete={forceRefetch}
          />

          <WorkspaceContent
            compact={compact}
            loading={loading}
            items={pagedItems}
            selectedItems={selectedItems}
            onToggleSelect={toggleSelectItem}
            onItemClick={(item) => {
              // openItem 시에도 정확한 타입을 넘깁니다.
              const targetId = (item.noteId ?? item.fileId)?.toString();
              if (targetId) openItem(item.type, targetId);
            }}
            notePageData={pageData}
            onPageChange={setPage}
            onDeleted={forceRefetch}
            viewMode={viewMode}
          />
        </div>
      )}
      right={
        <WorkspacePanel
          selectedId={selectedId}
          selectedType={selectedType}
          selectedFileName={selectedItemTitle}
          onClose={closePanel}
          onCreated={forceRefetch}
          onUpdated={forceRefetch}
        />
      }
    />
  );
}