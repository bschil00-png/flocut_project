// app/components/notes/NotesGridView.tsx
"use client";

import { useState } from "react";
import { FileText, Calendar, MoreVertical, Trash2 } from "lucide-react";
import { NoteListItem } from "@/lib/graphql/note/note.type";
import { useNoteAction } from "@/hooks/notes/useNoteAction";

interface Props {
  notes: NoteListItem[];
  onNoteClick?: (noteId: number) => void;
  onDeleted?: () => void;
}

export default function NotesGridView({ notes, onNoteClick, onDeleted }: Props) {
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);
  const { handleSoftDelete } = useNoteAction();

  const handleDelete = async (noteId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    await handleSoftDelete(noteId, onDeleted);
    setOpenMenuId(null);
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {notes.map((note) => (
        <div
          key={note.noteId}
          onClick={() => onNoteClick?.(note.noteId)}
          className="group relative rounded-xl p-4 sm:p-5 border-2 border-slate-200 dark:border-slate-800 hover:border-pink-300 dark:hover:border-pink-800 hover:shadow-lg hover:-translate-y-1 transition-all cursor-pointer bg-white dark:bg-slate-900"
        >
          {/* 더보기 버튼 */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setOpenMenuId(openMenuId === note.noteId ? null : note.noteId);
            }}
            className="absolute top-2 right-2 p-1.5 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
          >
            <MoreVertical size={14} />
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
              <div className="absolute right-2 top-10 w-48 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-lg z-20 overflow-hidden">
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

          <div className="flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4">
            <FileText size={32} className="text-green-500" />
          </div>

          <h3 className="font-medium text-center mb-2 line-clamp-2 min-h-[3rem] text-sm sm:text-base text-slate-900 dark:text-slate-100">
            {note.title || "제목 없음"}
          </h3>

          <div className="flex items-center justify-center gap-2 text-xs text-slate-500 dark:text-slate-400">
            <Calendar size={12} />
            <span>
              {note.moddate
                ? new Date(note.moddate).toLocaleDateString("ko-KR", {
                  month: "short",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })
                : note.regdate
                  ? new Date(note.regdate).toLocaleDateString("ko-KR", {
                    month: "short",
                    day: "numeric",
                  })
                  : "방금 전"}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}