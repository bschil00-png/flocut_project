"use client";

import WorkspaceListItem from "./WorkspaceListItem";
import WorkspaceGridItem from "@/app/components/layout/WorkspaceLayout/workspace/WorkspaceGridItem";
import Pagination from "@/app/components/ui/pagination/Pagination";
import EmptyState from "@/app/components/ui/empty-state/EmptyState";

import { File } from "lucide-react";
import { WorkspaceItem, ViewMode } from "@/hooks/workspace/workspace";

type PageData = {
    pageNumber: number;
    totalPages: number;
    totalElements: number;
    hasNext: boolean;
    hasPrevious: boolean;
    isFirst: boolean;
    isLast: boolean;
};

type Props = {
    compact: boolean;
    loading: boolean;
    items: WorkspaceItem[];
    selectedItems: Set<string>;
    onToggleSelect: (id: string) => void;
    onItemClick: (item: WorkspaceItem) => void;
    notePageData?: PageData;
    onPageChange: (page: number) => void;
    onDeleted: () => void;
    viewMode: ViewMode;
};

export default function WorkspaceContent({
                                             compact,
                                             loading,
                                             items,
                                             selectedItems,
                                             onToggleSelect,
                                             onItemClick,
                                             notePageData,
                                             onPageChange,
                                             onDeleted,
                                             viewMode,
                                         }: Props) {
    if (loading) {
        return (
            <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                    <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-accent border-t-transparent" />
                    <p className="mt-3 text-sm text-text-muted-light dark:text-text-muted-dark">
                        로딩 중...
                    </p>
                </div>
            </div>
        );
    }

    if (items.length === 0) {
        return (
            <EmptyState
                title="콘텐츠가 없습니다"
                description="새 노트를 생성하거나 파일을 업로드해보세요"
                icon={<File size={48} className="opacity-30" />}
            />
        );
    }

    return (
        <div className="flex-1 min-h-0 flex flex-col">
            {/* content */}
            <div className="flex-1 overflow-y-auto px-3 py-3 custom-scrollbar">
                {viewMode === "list" ? (
                    <div className="space-y-1">
                        {items.map((item) => (
                            <WorkspaceListItem
                                key={item.id}
                                item={item}
                                compact={compact}
                                selected={selectedItems.has(item.id)}
                                onToggleSelect={() => onToggleSelect(item.id)}
                                onClick={() => onItemClick(item)}
                                onDeleted={onDeleted}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                        {items.map((item) => (
                            <WorkspaceGridItem
                                key={item.id}
                                item={item}
                                selected={selectedItems.has(item.id)}
                                onToggleSelect={() => onToggleSelect(item.id)}
                                onClick={() => onItemClick(item)}
                                onDeleted={onDeleted}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* pagination */}
            {notePageData && notePageData.totalPages > 1 && (
                <div className="flex-shrink-0dark:border-border-dark">
                    <Pagination {...notePageData} onChange={onPageChange} />
                </div>
            )}
        </div>
    );
}
