"use client";

import Link from "next/link";
import IconButton from "@/app/components/ui/icon-button/IconButton";
import { Filter, LayoutGrid, List, Plus } from "lucide-react";

export default function NotesFilterBar({
                                         sortBy,
                                         viewMode,
                                         onChangeSort,
                                         onChangeViewMode,
                                         sessionId, // 현재 세션 ID 필요
                                       }: {
  sortBy: string;
  viewMode: "grid" | "list";
  onChangeSort: (v: string) => void;
  onChangeViewMode: (v: "grid" | "list") => void;
  sessionId: number;
}) {
  return (
    <div className="flex items-center justify-between px-8 py-3 border-b border-border-light dark:border-border-dark">
      {/* 왼쪽 영역: 필터 + 정렬 */}
      <div className="flex items-center gap-2">
        <IconButton
          icon={<Filter size={16} />}
          className="hover:bg-accent-soft dark:hover:bg-accent-soft"
        />

        <select
          value={sortBy}
          onChange={(e) => onChangeSort(e.target.value)}
          className="
            px-3 py-1.5 rounded-md border
            border-border-light dark:border-border-dark
            bg-background-light dark:bg-background-dark
            text-text-primary-light dark:text-white
            hover:bg-accent-soft dark:hover:bg-accent-soft
            transition-colors text-sm cursor-pointer
          "
        >
          <option value="recent">최근 수정순</option>
          <option value="created">생성일순</option>
          <option value="title">제목순</option>
        </select>
      </div>

      {/* 오른쪽 영역: 새 노트 + 뷰 모드 */}
      <div className="flex items-center gap-3">
        {/* 새 노트 생성 */}
        <Link
          href={`/workspace/${sessionId}/notes/new`}
          className="
            flex items-center gap-1
            px-3 py-1.5
            text-sm font-medium
            rounded-md
            bg-accent text-white
            hover:bg-accent/90
            transition-colors
          "
        >
          <Plus size={14} />
          새 노트
        </Link>

        {/* 뷰 모드 토글 */}
        <div
          className="
            flex items-center gap-1 p-1 rounded-lg
            bg-surface-light dark:bg-surface-dark
            border border-border-light dark:border-border-dark
          "
        >
          <button
            onClick={() => onChangeViewMode("grid")}
            className={`
              p-1.5 rounded transition-colors
              ${
              viewMode === "grid"
                ? "bg-accent text-white"
                : "text-text-muted-light dark:text-white hover:bg-accent-soft"
            }
            `}
          >
            <LayoutGrid size={16} />
          </button>

          <button
            onClick={() => onChangeViewMode("list")}
            className={`
              p-1.5 rounded transition-colors
              ${
              viewMode === "list"
                ? "bg-accent text-white"
                : "text-text-muted-light dark:text-white hover:bg-accent-soft"
            }
            `}
          >
            <List size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
