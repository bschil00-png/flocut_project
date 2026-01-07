// app/components/notes/NotesListView.tsx
"use client";

import { useState } from "react";
import { FileText, MoreVertical, Trash2, Move } from "lucide-react";
import { NoteListItem } from "@/lib/graphql/note/note.type";
import { useNoteAction } from "@/hooks/notes/useNoteAction";

interface Props {
  notes: NoteListItem[];
  onNoteClick?: (noteId: number) => void;
  onDeleted?: () => void;
}

export default function NotesListView({ notes, onNoteClick, onDeleted }: Props) {
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);
  const { handleSoftDelete } = useNoteAction();

  const handleDelete = async (noteId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    await handleSoftDelete(noteId, onDeleted);
    setOpenMenuId(null);
  };

  return (
    <div className="space-y-2">
      {notes.map((note) => (
        <div
          key={note.noteId}
          onClick={() => onNoteClick?.(note.noteId)}
          className="group relative flex items-center gap-3 sm:gap-4 px-3 sm:px-4 py-2 sm:py-3 rounded-lg border border-slate-200 dark:border-slate-800 hover:border-pink-300 dark:hover:border-pink-800 hover:bg-pink-50 dark:hover:bg-pink-900/10 transition-all cursor-pointer bg-white dark:bg-slate-900"
        >
          <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 group-hover:bg-pink-100 dark:group-hover:bg-pink-900/20 transition-colors flex-shrink-0">
            <FileText size={18} className="text-green-500" />
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-sm sm:text-base text-slate-800 dark:text-slate-200 truncate mb-1">
              {note.title || "제목 없음"}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {note.moddate
                ? new Date(note.moddate).toLocaleDateString("ko-KR", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })
                : note.regdate
                  ? new Date(note.regdate).toLocaleDateString("ko-KR", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })
                  : "방금 전"}
            </p>
          </div>

          {/* 더보기 메뉴 */}
          <div className="relative">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setOpenMenuId(openMenuId === note.noteId ? null : note.noteId);
              }}
              className="p-2 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
            >
              <MoreVertical size={16} />
            </button>

            {openMenuId === note.noteId && (
              <>
                {/* 배경 오버레이 */}
                <div
                  className="fixed inset-0 z-10"
                  onClick={(e) => {
                    e.stopPropagation();
                    setOpenMenuId(null);
                  }}
                />

                {/* 메뉴 */}
                <div className="absolute right-0 top-full mt-1 w-48 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-lg z-20 overflow-hidden">
                  <button
                    onClick={(e) => handleDelete(note.noteId, e)}
                    className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                  >
                    <Trash2 size={14} />
                    휴지통으로 이동
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}