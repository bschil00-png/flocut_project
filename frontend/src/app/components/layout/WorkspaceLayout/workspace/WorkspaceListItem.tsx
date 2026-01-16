"use client";

import { useState, useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
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

  // Redux에서 noteId와 fileId를 모두 가져와서 문서 클릭 시에도 대응
  const {
    noteId: editingNoteId,
    fileId: editingFileId,
    title: editingTitle
  } = useSelector((state: RootState) => state.editor);

  const { handleSoftDelete } = useNoteAction();
  const { handleDeleteWithConfirm } = useFileAction();

  // 노트 ID 혹은 파일 ID가 에디터에 열려있는지 판별
  const isEditingThis =
    (item.noteId !== undefined && Number(editingNoteId) === Number(item.noteId)) ||
    (item.fileId !== undefined && Number(editingFileId) === Number(item.fileId));

  // 수정 중이라면 리덕스 데이터(editingTitle)를 우선 노출
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

  // 3. 날짜 포맷 수정: 시간과 분을 포함하도록 변경
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
        <h3 className="text-sm font-medium flex items-center gap-2 overflow-hidden">
                    <span className="truncate flex-1">
                        {displayTitle || "제목 없음"}
                    </span>
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