"use client";

import Card from "@/app/components/ui/card/Card";
import IconButton from "@/app/components/ui/icon-button/IconButton";
import Tag from "@/app/components/ui/tag/Tag";
import { Mic, FileText, Star, Clock, MoreHorizontal } from "lucide-react";
import { useRouter } from "next/navigation";

export default function NotesGridView({ notes }: { notes: any[] }) {
  const router = useRouter();

  const iconFor = (type: string) => {
    if (type === "audio") return <Mic size={16} className="text-accent" />;
    return <FileText size={16} className="text-text-muted-light dark:text-text-muted-dark" />;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {notes.map((note) => (
        <Card
          key={note.id}
          interactive
          padding="md"
          onClick={() => router.push(`/notes/${note.id}`)}
        >
          {/* 상단 아이콘 & More */}
          <div className="flex items-start justify-between mb-3">
            {iconFor(note.type)}

            <div className="flex items-center gap-1">
              {note.starred && (
                <Star size={14} className="fill-accent text-accent" />
              )}

              <IconButton
                icon={<MoreHorizontal size={14} />}
                onClick={(e) => e.stopPropagation()}
                className="opacity-0 group-hover:opacity-100 transition-opacity"
              />
            </div>
          </div>

          {/* 제목 */}
          <h3 className="text-base font-semibold text-text-primary-light dark:text-white line-clamp-2 mb-2">
            {note.title}
          </h3>

          {/* 요약 */}
          <p className="text-sm text-text-muted-light dark:text-text-muted-dark line-clamp-2 mb-3">
            {note.preview}
          </p>

          {/* footer 영역 */}
          <div className="flex items-center justify-between text-xs text-text-muted-light dark:text-text-muted-dark">
            <div className="flex items-center gap-1">
              <Clock size={12} />
              <span>{note.date}</span>
            </div>

            <div className="flex items-center gap-1">
              {note.tags.slice(0, 2).map((tag) => (
                <Tag key={tag}>{tag}</Tag>
              ))}
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
