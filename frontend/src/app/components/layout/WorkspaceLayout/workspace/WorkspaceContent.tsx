"use client";

import WorkspaceListItem from "./WorkspaceListItem";
import Pagination from "@/app/components/ui/pagination/Pagination";
import { File } from "lucide-react";
import { WorkspaceItem, ViewMode } from "@/hooks/workspace/workspace";
import EmptyState from "@/app/components/ui/empty-state/EmptyState";

// 클라이언트 페이지 데이터 타입
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
            {/* 리스트/그리드 렌더링 */}
            <div className="flex-1 overflow-y-auto px-3 py-3">
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

            {/* 페이지네이션 */}
            {notePageData && notePageData.totalPages > 1 && (
                <div className="flex-shrink-0 border-t border-border-light dark:border-border-dark">
                    <Pagination {...notePageData} onChange={onPageChange} />
                </div>
            )}
        </div>
    );
}

// 그리드 아이템 컴포넌트
function WorkspaceGridItem({
                               item,
                               selected,
                               onToggleSelect,
                               onClick,
                               onDeleted,
                           }: {
    item: WorkspaceItem;
    selected: boolean;
    onToggleSelect: () => void;
    onClick: () => void;
    onDeleted: () => void;
}) {
    const typeIcons = {
        note: "N",
        document: "D",
        audio: "M",
    };

    const icon = typeIcons[item.type] ?? "📄";

    const formattedDate = item.date
        ? new Date(item.date).toLocaleDateString("ko-KR", {
            year: "numeric",
            month: "short",
            day: "numeric",
        })
        : "";

    return (
        <div
            className={`
                group
                relative
                p-4
                rounded-lg
                border border-border-light dark:border-border-dark
                bg-white dark:bg-surface-dark
                hover:shadow-md
                transition-all
                cursor-pointer
                ${selected ? "ring-2 ring-accent" : ""}
            `}
            onClick={onClick}
        >
            {/* 체크박스 */}
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <input
                    type="checkbox"
                    checked={selected}
                    onChange={(e) => {
                        e.stopPropagation();
                        onToggleSelect();
                    }}
                    className="h-4 w-4 rounded border-border-light dark:border-border-dark text-accent focus:ring-accent cursor-pointer"
                />
            </div>

            {/* 아이콘 */}
            <div className="text-3xl mb-3">{icon}</div>

            {/* 제목 */}
            <h3 className="text-sm font-medium text-text-primary-light dark:text-text-primary-dark truncate mb-1">
                {item.title}
            </h3>

            {/* 날짜 */}
            <p className="text-xs text-text-muted-light dark:text-text-muted-dark">
                {formattedDate}
            </p>
        </div>
    );
}