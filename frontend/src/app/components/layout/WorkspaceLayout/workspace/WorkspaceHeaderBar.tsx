"use client";

import Button from "@/app/components/ui/button/Button";
import FileUploadButton from "@/app/components/files/FileUploadButton";
import { Plus } from "lucide-react";
import { WorkspaceFilter } from "@/hooks/workspace/workspace";

type Props = {
  filter: WorkspaceFilter;
  onChangeFilter: (f: WorkspaceFilter) => void;
  selectedCount: number;
  onClearSelection: () => void;

  sessionId: number;
  onUploaded: () => void;
  onNewNote: () => void;
};

export default function WorkspaceHeaderBar({
                                             filter,
                                             onChangeFilter,
                                             selectedCount,
                                             onClearSelection,
                                             sessionId,
                                             onUploaded,
                                             onNewNote,
                                           }: Props) {
  return (
    <div className="bg-white dark:bg-surface-dark border-b">
      <div className="px-4 lg:px-8 py-4 flex justify-between items-center">
        <div className="flex gap-1">
          {(["all", "note", "document", "audio"] as WorkspaceFilter[]).map(
            (t) => (
              <button
                key={t}
                onClick={() => onChangeFilter(t)}
                className={`px-4 py-1.5 rounded-lg text-sm font-semibold ${
                  filter === t
                    ? "bg-accent text-white"
                    : "text-text-muted-light hover:bg-accent-soft"
                }`}
              >
                {t === "all"
                  ? "전체"
                  : t === "note"
                    ? "노트"
                    : t === "document"
                      ? "문서"
                      : "음성"}
              </button>
            )
          )}
        </div>

        <div className="flex items-center gap-2">
          {selectedCount > 0 && (
            <Button size="sm" variant="ghost" onClick={onClearSelection}>
              선택 해제
            </Button>
          )}

          <FileUploadButton
            sessionId={sessionId}
            onUploadComplete={onUploaded}
          />

          <Button size="sm" onClick={onNewNote}>
            <Plus size={16} /> 새 노트
          </Button>
        </div>
      </div>
    </div>
  );
}
