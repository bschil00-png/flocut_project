"use client";

import WorkspaceListItem from "./WorkspaceListItem";
import Pagination from "@/app/components/ui/pagination/Pagination";
import { File } from "lucide-react";
import { NotePage } from "@/lib/graphql/note/note.type";
import { WorkspaceItem } from "@/hooks/workspace/workspace";

type Props = {
  loading: boolean;
  items: WorkspaceItem[];
  sessionId: number;

  selectedItems: Set<string>;
  onToggleSelect: (id: string) => void;
  onItemClick: (item: WorkspaceItem) => void;

  notePageData?: NotePage;
  onPageChange: (page: number) => void;
  onDeleted: () => void;
};

export default function WorkspaceContent({
                                           loading,
                                           items,
                                           sessionId,
                                           selectedItems,
                                           onToggleSelect,
                                           onItemClick,
                                           notePageData,
                                           onPageChange,
                                           onDeleted,
                                         }: Props) {
  if (loading) {
    return <div className="py-20 text-center">로딩중</div>;
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-20">
        <File size={64} className="mx-auto opacity-20 mb-4" />
        <p>콘텐츠가 없습니다</p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-1 px-4 lg:px-8 py-6">
        {items.map((item) => (
          <WorkspaceListItem
            key={item.id}
            item={item}
            sessionId={sessionId}
            selected={selectedItems.has(item.id)}
            onToggleSelect={() => onToggleSelect(item.id)}
            onClick={() => onItemClick(item)}
            onDeleted={onDeleted}
          />
        ))}
      </div>

      {notePageData && (
        <Pagination {...notePageData} onChange={onPageChange} />
      )}
    </>
  );
}
