"use client";

import { useState } from "react";
import Button from "@/app/components/ui/button/Button";
import FileUploadButton from "@/app/components/files/FileUploadButton";
import {
    Plus,
    Layers,
    FileText,
    File,
    Mic,
    Search,
    X,
    SlidersHorizontal,
    LayoutGrid,
    List as ListIcon,
    ChevronDown,
    Trash2,
    CheckSquare,
} from "lucide-react";
import { WorkspaceFilter, SortBy, ViewMode } from "@/hooks/workspace/workspace";
import { useMediaQuery } from "@/hooks/common/useMediaQuery";
import { useNoteAction } from "@/hooks/notes/useNoteAction";
import { useFileAction } from "@/hooks/files/useFileAction";
import { toast } from "sonner";

type Props = {
    filter: WorkspaceFilter;
    onChangeFilter: (f: WorkspaceFilter) => void;
    selectedCount: number;
    onClearSelection: () => void;
    onSelectAll: () => void;
    totalItems: number;

    sessionId: number;
    onUploaded: () => void;
    onNewNote: () => void;

    searchQuery: string;
    onSearchChange: (query: string) => void;
    sortBy: SortBy;
    onSortChange: (sort: SortBy) => void;
    viewMode: ViewMode;
    onViewModeChange: (mode: ViewMode) => void;

    //  대량 삭제용 추가
    allItems: Array<{ id: string; type: string; noteId?: number; fileId?: number }>;
    selectedItems: Set<string>;
    onBulkDeleteComplete: () => void;
};

export default function WorkspaceHeaderBar({
                                               filter,
                                               onChangeFilter,
                                               selectedCount,
                                               onClearSelection,
                                               onSelectAll,
                                               totalItems,
                                               sessionId,
                                               onUploaded,
                                               onNewNote,
                                               searchQuery,
                                               onSearchChange,
                                               sortBy,
                                               onSortChange,
                                               viewMode,
                                               onViewModeChange,
                                               allItems,
                                               selectedItems,
                                               onBulkDeleteComplete,
                                           }: Props) {
    const isMobile = useMediaQuery("(max-width: 640px)");
    const isTablet = useMediaQuery("(max-width: 900px)");
    const [showSortDropdown, setShowSortDropdown] = useState(false);

    const { handleSoftDelete } = useNoteAction();
    const { handleDelete: handleFileDelete } = useFileAction();

    const filters: {
        key: WorkspaceFilter;
        label: string;
        icon: React.ReactNode;
    }[] = [
        { key: "all", label: "전체", icon: <Layers size={16} /> },
        { key: "note", label: "노트", icon: <FileText size={16} /> },
        { key: "document", label: "문서", icon: <File size={16} /> },
        // { key: "audio", label: "음성", icon: <Mic size={16} /> }, 임시 주석 (노트에서 음성 녹음 존재)
    ];

    const sortOptions = [
        { value: "recent" as const, label: "최근 수정순" },
        { value: "created" as const, label: "최신 생성순" },
        { value: "title" as const, label: "가나다순" },
    ];

    const currentSortLabel =
        sortOptions.find((opt) => opt.value === sortBy)?.label ?? "정렬";

    const allSelected = selectedCount > 0 && selectedCount === totalItems;

    //  대량 삭제 핸들러
    const handleBulkDelete = async () => {
        if (selectedCount === 0) return;

        const confirmed = window.confirm(
            `${selectedCount}개 항목을 삭제하시겠습니까?`
        );

        if (!confirmed) return;

        try {
            const noteIds = allItems
                .filter((item) => selectedItems.has(item.id) && item.noteId)
                .map((item) => item.noteId!);

            const fileIds = allItems
                .filter((item) => selectedItems.has(item.id) && item.fileId)
                .map((item) => item.fileId!);

            //  노트 휴지통 이동
            for (const noteId of noteIds) {
                await handleSoftDelete(noteId);
            }

            //  파일 즉시 삭제
            for (const fileId of fileIds) {
                await handleFileDelete(fileId);
            }

            toast.success("선택한 항목이 삭제되었습니다.");
            onClearSelection();
            onBulkDeleteComplete();
        } catch (error) {
            toast.error("삭제 중 오류가 발생했습니다.");
            console.error(error);
        }
    };

    return (
        <div className="bg-white dark:bg-surface-dark">
            {/* 선택 모드 바 */}
            {selectedCount > 0 && (
                <div className="px-4 lg:px-6 py-3 bg-accent-soft border-b border-accent/20">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <span className="text-sm font-medium text-accent">
                                {selectedCount}개 선택됨
                            </span>
                            <button
                                onClick={allSelected ? onClearSelection : onSelectAll}
                                className="text-xs text-accent hover:underline"
                            >
                                {allSelected ? "선택 해제" : "전체 선택"}
                            </button>
                        </div>

                        <div className="flex items-center gap-2">
                            <Button
                                size="sm"
                                variant="secondary"
                                onClick={handleBulkDelete}
                            >
                                <Trash2 size={14} />
                                <span className="hidden sm:inline">삭제</span>
                            </Button>

                            <Button
                                size="sm"
                                variant="ghost"
                                onClick={onClearSelection}
                            >
                                <X size={14} />
                                <span className="hidden sm:inline">취소</span>
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {/* 통합된 단일 행 */}
            <div className="px-4 lg:px-6 py-4">
                <div className="flex items-center gap-3 flex-wrap">
                    {/* 좌측: 검색바 */}
                    <div className="relative flex-1 min-w-[200px] max-w-md">
                        <Search
                            size={18}
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted-light dark:text-text-muted-dark pointer-events-none"
                        />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => onSearchChange(e.target.value)}
                            placeholder="문서, 노트 검색..."
                            className="
                                w-full h-10
                                pl-10 pr-10
                                rounded-lg
                                bg-surface-light dark:bg-surface-input
                                border border-border-light dark:border-white/10
                                text-sm
                                text-text-primary-light dark:text-text-primary-dark
                                placeholder:text-text-muted-light dark:placeholder:text-text-muted-dark
                                focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent
                                transition-all
                            "
                        />
                        {searchQuery && (
                            <button
                                onClick={() => onSearchChange("")}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted-light hover:text-text-primary-light dark:hover:text-text-primary-dark transition-colors"
                                aria-label="검색 지우기"
                            >
                                <X size={16} />
                            </button>
                        )}
                    </div>

                    {/* 필터 탭 */}
                    {!isMobile && (
                        <>
                            <div className="h-6 w-px bg-border-light dark:bg-border-dark" />
                            <div className="flex gap-1">
                                {filters.map(({ key, label, icon }) => (
                                    <button
                                        key={key}
                                        onClick={() => onChangeFilter(key)}
                                        className={`
                                            flex items-center gap-1.5
                                            px-3 py-1.5 h-9
                                            rounded-lg text-sm font-medium
                                            transition-all whitespace-nowrap
                                            ${
                                            filter === key
                                                ? "bg-accent text-white shadow-sm"
                                                : "text-text-muted-light dark:text-text-muted-dark hover:bg-accent-soft dark:hover:bg-accent-soft"
                                        }
                                        `}
                                    >
                                        {icon}
                                        <span>{label}</span>
                                    </button>
                                ))}
                            </div>
                        </>
                    )}

                    {/* Spacer */}
                    <div className="flex-1 min-w-0" />

                    {/* 우측: 액션 */}
                    <div className="flex items-center gap-2 flex-shrink-0">
                        {/* 전체 선택 버튼 */}
                        {!isMobile && totalItems > 0 && (
                            <Button
                                size="sm"
                                variant="ghost"
                                onClick={onSelectAll}
                                aria-label="전체 선택"
                                title="전체 선택"
                            >
                                <CheckSquare size={16} />
                            </Button>
                        )}

                        {/* 정렬 드롭다운 */}
                        {!isMobile && (
                            <div className="relative">
                                <button
                                    onClick={() => setShowSortDropdown(!showSortDropdown)}
                                    className="
                                        flex items-center gap-1.5
                                        px-3 py-1.5 h-9
                                        rounded-lg text-sm
                                        border border-border-light dark:border-border-dark
                                        text-text-primary-light dark:text-text-primary-dark
                                        hover:bg-accent-soft dark:hover:bg-accent-soft
                                        transition-colors
                                    "
                                >
                                    <SlidersHorizontal size={14} />
                                    <span className="hidden sm:inline">{currentSortLabel}</span>
                                    <ChevronDown size={14} />
                                </button>

                                {showSortDropdown && (
                                    <>
                                        <div
                                            className="fixed inset-0 z-10"
                                            onClick={() => setShowSortDropdown(false)}
                                        />
                                        <div className="absolute right-0 top-full mt-1 z-20 min-w-[160px] rounded-lg border border-border-light dark:border-border-dark bg-white dark:bg-surface-dark shadow-lg py-1">
                                            {sortOptions.map((opt) => (
                                                <button
                                                    key={opt.value}
                                                    onClick={() => {
                                                        onSortChange(opt.value);
                                                        setShowSortDropdown(false);
                                                    }}
                                                    className={`
                                                        w-full px-3 py-2 text-left text-sm
                                                        hover:bg-accent-soft dark:hover:bg-accent-soft
                                                        transition-colors
                                                        ${
                                                        sortBy === opt.value
                                                            ? "text-accent font-medium"
                                                            : "text-text-primary-light dark:text-text-primary-dark"
                                                    }
                                                    `}
                                                >
                                                    {opt.label}
                                                </button>
                                            ))}
                                        </div>
                                    </>
                                )}
                            </div>
                        )}

                        {/* 뷰모드 토글 */}
                        {!isMobile && (
                            <div className="flex items-center gap-0.5 p-0.5 rounded-lg bg-surface-light dark:bg-surface-input border border-border-light dark:border-border-dark">
                                <button
                                    onClick={() => onViewModeChange("list")}
                                    className={`
                                        p-1.5 rounded-md transition-all
                                        ${
                                        viewMode === "list"
                                            ? "bg-white dark:bg-surface-dark text-accent shadow-sm"
                                            : "text-text-muted-light dark:text-text-muted-dark hover:text-text-primary-light dark:hover:text-text-primary-dark"
                                    }
                                    `}
                                    aria-label="리스트 뷰"
                                    title="리스트 뷰"
                                >
                                    <ListIcon size={16} />
                                </button>
                                <button
                                    onClick={() => onViewModeChange("grid")}
                                    className={`
                                        p-1.5 rounded-md transition-all
                                        ${
                                        viewMode === "grid"
                                            ? "bg-white dark:bg-surface-dark text-accent shadow-sm"
                                            : "text-text-muted-light dark:text-text-muted-dark hover:text-text-primary-light dark:hover:text-text-primary-dark"
                                    }
                                    `}
                                    aria-label="그리드 뷰"
                                    title="그리드 뷰"
                                >
                                    <LayoutGrid size={16} />
                                </button>
                            </div>
                        )}

                        {/* 파일 업로드 */}
                        <FileUploadButton
                            sessionId={sessionId}
                            onUploadComplete={onUploaded}
                            iconOnly={isTablet}
                        />

                        {/* 새 노트 */}
                        <Button
                            size="sm"
                            onClick={onNewNote}
                            aria-label="새 노트"
                            title="새 노트"
                        >
                            <Plus size={16} />
                            {!isTablet && <span>새 노트</span>}
                        </Button>
                    </div>
                </div>
            </div>

            {/* 모바일: 필터 탭 */}
            {isMobile && (
                <div className="px-4 pb-3">
                    <div className="flex gap-1 overflow-x-auto scrollbar-hide">
                        {filters.map(({ key, label, icon }) => (
                            <button
                                key={key}
                                onClick={() => onChangeFilter(key)}
                                className={`
                                    flex items-center gap-1.5
                                    px-3 py-1.5
                                    rounded-lg text-sm font-medium
                                    transition-all whitespace-nowrap
                                    ${
                                    filter === key
                                        ? "bg-accent text-white shadow-sm"
                                        : "text-text-muted-light dark:text-text-muted-dark hover:bg-accent-soft dark:hover:bg-accent-soft"
                                }
                                `}
                            >
                                {icon}
                                <span>{label}</span>
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* 활성 필터 칩 (검색어) */}
            {searchQuery && (
                <div className="px-4 lg:px-6 pb-3">
                    <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs text-text-muted-light dark:text-text-muted-dark">
                            검색:
                        </span>
                        <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-accent-soft text-accent text-xs font-medium">
                            "{searchQuery}"
                            <button
                                onClick={() => onSearchChange("")}
                                className="hover:text-accent-hover transition-colors"
                            >
                                <X size={12} />
                            </button>
                        </span>
                    </div>
                </div>
            )}
        </div>
    );
}