"use client";

import { useRouter, useParams } from "next/navigation";
import { Mic, FileText } from "lucide-react";

// 노트 리스트 뷰
export default function NotesListView({ notes }: { notes: any[] }) {
  const router = useRouter();
  const { sessionId } = useParams<{ sessionId: string }>();

  const iconFor = (sourceType?: string) => {
    if (sourceType === "AUDIO") return <Mic size={16} />;
    return <FileText size={16} />;
  };

  return (
    <div className="divide-y">
      {notes.map((note) => (
        <div
          key={note.noteId}
          onClick={() =>
            router.push(`/workspace/${sessionId}/notes/${note.noteId}`)
          }
          className="flex items-center gap-4 p-4 cursor-pointer hover:bg-accent-soft"
        >
          {iconFor(note.sourceType)}

          <div className="flex-1">
            <div className="font-medium">{note.title}</div>
            <div className="text-xs text-text-muted-light">
              {note.moddate ?? note.regdate}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
