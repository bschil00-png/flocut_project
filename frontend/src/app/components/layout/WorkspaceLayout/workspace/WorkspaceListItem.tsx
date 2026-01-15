"use client";

import { useState, useRef, useEffect } from "react";
import { useSelector } from "react-redux"; // 추가
import { RootState } from "@/store"; // 추가
import {
  FileText,
  File as FileIcon,
  Calendar,
  MoreVertical,
} from "lucide-react";

import { WorkspaceItem } from "@/hooks/workspace/workspace";
import { useNoteAction } from "@/hooks/notes/useNoteAction";
import { useFileAction } from "@/hooks/files/useFileAction";

import Divider from "@/app/components/ui/divider/Divider";
import Checkbox from "@/app/components/ui/form/Checkbox";

type Props = {
  item: WorkspaceItem;
  compact: boolean;
  selected: boolean;
  onToggleSelect: () => void;
  onClick: () => void;
  onDeleted: () => void;
};

export default function WorkspaceListItem({
                                            item,
                                            compact,
                                            selected,
                                            onToggleSelect,
                                            onClick,
                                            onDeleted,
                                          }: Props) {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const [menuPosition, setMenuPosition] = useState<"bottom" | "top">("bottom");

  // 1. Redux에서 현재 에디터가 편집 중인 정보를 실시간으로 가져옵니다.
  const { noteId: editingId, title: editingTitle } = useSelector(
    (state: RootState) => state.editor
  );

  const { handleSoftDelete } = useNoteAction();
  const { handleDeleteWithConfirm } = useFileAction();

  // 현재 아이템이 에디터에서 수정 중인 아이템인지 판별
  // 타입 불일치를 방지하기 위해 Number로 캐스팅하여 비교
  const isEditingThis = item.noteId !== undefined && Number(editingId) === Number(item.noteId);

  //수정 중이라면 서버 데이터(item.title)가 아닌 리덕스 데이터(editingTitle)를 우선 노출
  const displayTitle = isEditingThis ? editingTitle : item.title;

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowMenu(false);
      }
    };

    if (showMenu) {
      document.addEventListener("mousedown", handler);
    }
    return () => document.removeEventListener("mousedown", handler);
  }, [showMenu]);

  useEffect(() => {
    if (!showMenu || !menuButtonRef.current) return;

    const rect = menuButtonRef.current.getBoundingClientRect();
    const menuHeight = item.type === "note" ? 120 : 80;

    const spaceBelow = window.innerHeight - rect.bottom;
    const spaceAbove = rect.top;

    setMenuPosition(
      spaceBelow < menuHeight && spaceAbove > menuHeight ? "top" : "bottom"
    );
  }, [showMenu, item.type]);

  const handleMoveToTrash = async () => {
    if (!item.noteId) return;
    setShowMenu(false);
    await handleSoftDelete(item.noteId, onDeleted);
  };

  const handlePermanentDelete = async () => {
    if (!item.noteId) return;

    const confirmed = window.confirm(
      "영구 삭제된 노트는 복구할 수 없습니다. 계속하시겠습니까?"
    );

    if (!confirmed) {
      setShowMenu(false);
      return;
    }

    setShowMenu(false);
    await handleSoftDelete(item.noteId, onDeleted);
  };

  const handleFileDelete = async () => {
    if (!item.fileId) return;
    setShowMenu(false);
    await handleDeleteWithConfirm(item.fileId, onDeleted);
  };

  const icon =
    item.type === "document" ? <FileIcon size={18} /> : <FileText size={18} />;

  const formattedDate = item.date
    ? new Date(item.date).toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
    : "";

  return (
    <div
      // 호버 시 브라우저 기본 툴팁으로 전체 제목이 보이게 설정
      title={displayTitle}
      className={`
                flex items-center gap-3 px-3 py-2 rounded-lg
                border transition-all cursor-pointer
                ${selected ? "bg-accent-soft border-accent" : "bg-white dark:bg-surface-dark border-border-light dark:border-border-dark"}
                ${isEditingThis ? "ring-2 ring-accent/20 border-accent/40 shadow-sm" : "hover:border-accent/30"}
            `}
    >
      <Checkbox
        checked={selected}
        onChange={() => onToggleSelect()}
        className="flex-shrink-0"
      />

      <div className="flex-shrink-0 text-text-muted-light dark:text-text-muted-dark">
        {icon}
      </div>

      <div className="flex-1 min-w-0 cursor-pointer" onClick={onClick}>
        {/*  제목이 길면 ...으로 생략되도록 truncate 속성을 강화합니다. */}
        <h3 className="text-sm font-medium flex items-center gap-2 overflow-hidden">
                    <span className="truncate flex-1">
                        {displayTitle || "제목 없음"}
                    </span>
          {/* 수정 중일 때 시각적 피드백(작은 점)을 추가 */}
          {isEditingThis && (
            <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse flex-shrink-0" />
          )}
        </h3>

        <div className="mt-0.5 flex items-center gap-1.5 text-xs text-text-muted-light dark:text-text-muted-dark">
          <Calendar size={12} />
          <span className="truncate">{formattedDate}</span>
        </div>
      </div>

      <div ref={menuRef} className="relative flex-shrink-0">
        <button
          ref={menuButtonRef}
          onClick={(e) => {
            e.stopPropagation();
            setShowMenu((prev) => !prev);
          }}
          className="p-2 rounded-lg hover:bg-surface-light dark:hover:bg-surface-input transition-colors text-text-muted-light dark:text-text-muted-dark"
        >
          <MoreVertical size={16} />
        </button>

        {showMenu && (
          <>
            <div
              className="fixed inset-0 z-[100]"
              onClick={() => setShowMenu(false)}
            />

            <div
              className={`
                                absolute right-0 z-[101]
                                min-w-[120px] py-1 rounded-lg shadow-xl
                                bg-background-light dark:bg-surface-dark
                                border border-border-light dark:border-border-dark
                                ${menuPosition === "top" ? "bottom-full mb-2" : "top-full mt-2"}
                            `}
            >
              {item.type === "note" && (
                <>
                  <button
                    onClick={handleMoveToTrash}
                    className="w-full px-3 py-2 text-left text-sm hover:bg-accent-soft text-text-primary-light dark:text-text-primary-dark"
                  >
                    휴지통
                  </button>

                  <Divider />

                  <button
                    onClick={handlePermanentDelete}
                    className="w-full px-3 py-2 text-left text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                  >
                    영구삭제
                  </button>
                </>
              )}

              {item.type === "document" && (
                <button
                  onClick={handleFileDelete}
                  className="w-full px-3 py-2 text-left text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                >
                  삭제
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}