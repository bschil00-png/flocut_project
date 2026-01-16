"use client";

import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { File, FileText, Mic, Calendar } from "lucide-react";
import { WorkspaceItem } from "@/hooks/workspace/workspace";

type Props = {
  item: WorkspaceItem;
  selected: boolean;
  onToggleSelect: () => void;
  onClick: () => void;
  onDeleted: () => void;
};

export default function WorkspaceGridItem({
                                            item,
                                            selected,
                                            onToggleSelect,
                                            onClick,
                                          }: Props) {

  const {
    noteId: editingNoteId,
    fileId: editingFileId,
    title: editingTitle
  } = useSelector((state: RootState) => state.editor);

  // 현재 아이템이 노트든 문서든 패널에 열려있는지 확인
  const isEditingThis =
    (item.noteId !== undefined && Number(editingNoteId) === Number(item.noteId)) ||
    (item.fileId !== undefined && Number(editingFileId) === Number(item.fileId));

  const displayTitle = isEditingThis ? editingTitle : item.title;

  const icon = {
    note: <FileText size={32} />,
    document: <File size={32} />,
    audio: <Mic size={32} />,
  }[item.type];

  const formattedDate = item.date
    ? new Date(item.date).toLocaleString("ko-KR", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    })
    : "";

  return (
    <div
      title={displayTitle}
      className={`
        group relative p-4 rounded-lg
        border transition-all cursor-pointer
        bg-white dark:bg-surface-dark
        ${selected ? "bg-accent-soft border-accent" : "border-border-light dark:border-border-dark"}
        /* 패널에 열린 아이템(노트/문서 공통) 테두리 강조 */
        ${isEditingThis ? "ring-2 ring-accent/20 border-accent shadow-sm" : "hover:border-accent/30"}
      `}
      onClick={onClick}
    >
      {/* 기존 반응형 체크박스 위치 유지 */}
      <div className={`absolute top-2 right-2 transition-opacity ${selected ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}>
        <input
          type="checkbox"
          checked={selected}
          onChange={(e) => {
            e.stopPropagation();
            onToggleSelect();
          }}
          className="h-4 w-4 rounded border-border-light dark:border-border-dark text-accent cursor-pointer"
        />
      </div>

      <div className={`mb-3 ${isEditingThis ? "text-accent" : "text-text-muted-light dark:text-text-muted-dark"}`}>
        {icon}
      </div>

      <h3 className="text-sm font-medium flex items-center gap-1.5 mb-1 overflow-hidden">
        <span className="truncate flex-1">
          {displayTitle || "제목 없음"}
        </span>
        {/* 모든 타입에 대해 편집 중일 때 작은 점 표시 */}
        {isEditingThis && (
          <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse flex-shrink-0" />
        )}
      </h3>

      <div className="flex items-center gap-1 text-xs text-text-muted-light dark:text-text-muted-dark">
        <Calendar size={12} className="flex-shrink-0" />
        <span className="truncate">{formattedDate}</span>
      </div>
    </div>
  );
}