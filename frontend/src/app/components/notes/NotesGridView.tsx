"use client";

import { useRouter, useParams } from "next/navigation";
import { Mic, FileText } from "lucide-react";

// 노트 카드 그리드 뷰
export default function NotesGridView({ notes }: { notes: any[] }) {
  const router = useRouter();
  const { sessionId } = useParams<{ sessionId: string }>();

  // sourceType에 따라 아이콘 분기
  const iconFor = (sourceType?: string) => {
    if (sourceType === "AUDIO") return <Mic size={16} />;
    return <FileText size={16} />;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {notes.map((note) => (
        <div
          key={note.noteId}
          onClick={() =>
            router.push(`/workspace/${sessionId}/notes/${note.noteId}`)
          }
          className="border rounded-lg p-4 cursor-pointer hover:bg-accent-soft"
        >
          <div className="flex items-center gap-2 mb-2">
            {iconFor(note.sourceType)}
            <h3 className="font-medium">{note.title}</h3>
          </div>

          <div className="text-xs text-text-muted-light">
            {note.moddate ?? note.regdate}
          </div>
        </div>
      ))}
    </div>
  );
}
