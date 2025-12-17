"use client";

import List from "@/app/components/ui/list/List";
import ListItem from "@/app/components/ui/list/ListItem";
import Tag from "@/app/components/ui/tag/Tag";
import IconButton from "@/app/components/ui/icon-button/IconButton";

import { Mic, FileText, Star, MoreHorizontal } from "lucide-react";
import { useRouter } from "next/navigation";

export default function NotesListView({ notes }: { notes: any[] }) {
  const router = useRouter();

  const iconFor = (type: string) => {
    if (type === "audio") return <Mic size={18} className="text-accent" />;
    return <FileText size={18} className="text-text-muted-light dark:text-text-muted-dark" />;
  };

  return (
    <List className="divide-y divide-border-light dark:divide-border-dark">
      {notes.map((note) => (
        <div
          key={note.id}
          onClick={() => router.push(`/notes/${note.id}`)}
          className="
                        group flex items-start gap-4 p-4
                        cursor-pointer
                        hover:bg-accent-soft/40
                        transition-colors
                    "
        >
          {/* 아이콘 */}
          <div
            className="
                            flex items-center justify-center
                            w-10 h-10
                            rounded-md
                            bg-surface-light dark:bg-surface-dark
                            flex-shrink-0
                        "
          >
            {iconFor(note.type)}
          </div>

          {/* 가운데 텍스트 영역 */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-sm font-medium text-text-primary-light dark:text-white truncate">
                {note.title}
              </h3>

              {note.starred && (
                <Star size={12} className="fill-accent text-accent flex-shrink-0" />
              )}
            </div>

            {/* preview */}
            <p className="text-xs text-text-muted-light dark:text-text-muted-dark truncate">
              {note.preview}
            </p>

            {/* tags */}
            <div className="flex gap-1 mt-2">
              {note.tags.slice(0, 2).map((tag) => (
                <Tag key={tag}>{tag}</Tag>
              ))}
            </div>
          </div>

          {/* 오른쪽 metadata */}
          <div className="flex flex-col items-end gap-2 flex-shrink-0">
                        <span className="text-xs text-text-muted-light dark:text-text-muted-dark whitespace-nowrap">
                            {note.date}
                        </span>

            <IconButton
              icon={<MoreHorizontal size={16} />}
              onClick={(e) => e.stopPropagation()}
              className="
                                opacity-0 group-hover:opacity-100
                                transition-opacity
                            "
            />
          </div>
        </div>
      ))}
    </List>
  );
}
