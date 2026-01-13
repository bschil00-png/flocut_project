"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, Download } from "lucide-react";
import { toast } from "sonner";

import { useNoteEditor } from "@/hooks/notes/useNoteEditor";
import { useUnsavedLeaveGuard } from "@/hooks/common/useUnsavedLeaveGuard";

import Button from "@/app/components/ui/button/Button";
import IconButton from "@/app/components/ui/icon-button/IconButton";
import NoteTitleInput from "@/app/components/notes/editor/NoteTitleInput";
import NoteContentEditor from "@/app/components/notes/editor/NoteContentEditor";
import DownloadMenu from "@/app/components/notes/download/DownloadMenu";
import { DownloadData } from "@/app/components/notes/download/types";

type Props = {
  noteId: number;
  sessionId: number;
};

export default function FullPageNote({ noteId, sessionId }: Props) {
  const router = useRouter();

  const {
    localTitle,
    localContent,
    handleTitleChange,
    handleContentChange,
    editor,
    setEditor,
    saved,
    isSaving,
    stats,
    handleSync,
    loading,
  } = useNoteEditor(noteId);

  const [showDownload, setShowDownload] = useState(false);

  const handleSave = useCallback(async () => {
    if (handleSync) {
      await handleSync();
      toast.success("저장되었습니다");
    }
  }, [handleSync]);

  const { confirmNavigation } = useUnsavedLeaveGuard(
    !saved && !isSaving,
    handleSave
  );

  const handleBack = () => {
    confirmNavigation(() => {
      router.push(`/workspace/${sessionId}?type=note&id=${noteId}`);
    });
  };

  const downloadData: DownloadData = {
    title: localTitle || "제목 없음",
    content: editor?.getText() || "",
    htmlContent: localContent,
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-accent border-t-transparent" />
          <p className="mt-3 text-sm text-text-muted-light dark:text-text-muted-dark">
            로딩 중...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-white dark:bg-background-dark">
      {/* 상단 헤더 */}
      <header className="flex-shrink-0 h-14 border-b border-border-light dark:border-border-dark bg-white dark:bg-surface-dark">
        <div className="h-full px-4 flex items-center justify-between gap-4">
          {/* 좌측: 뒤로가기 + 제목 */}
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <IconButton
              icon={<ArrowLeft size={18} />}
              onClick={handleBack}
              aria-label="뒤로가기"
            />
            <h1 className="text-base font-semibold text-text-primary-light dark:text-text-primary-dark truncate">
              {localTitle || "제목 없음"}
            </h1>
          </div>

          {/* 우측: 액션 버튼 */}
          <div className="flex items-center gap-2">
            <div className="relative">
              <IconButton
                icon={<Download size={16} />}
                onClick={() => setShowDownload(!showDownload)}
                aria-label="다운로드"
              />
              {showDownload && (
                <DownloadMenu
                  data={downloadData}
                  onClose={() => setShowDownload(false)}
                />
              )}
            </div>

            <Button
              size="sm"
              variant={saved ? "secondary" : "primary"}
              loading={isSaving}
              disabled={saved}
              onClick={handleSave}
            >
              <Save size={14} />
              <span className="hidden sm:inline">{saved ? "저장됨" : "저장"}</span>
            </Button>
          </div>
        </div>
      </header>

      {/* 메인 에디터 */}
      <main className="flex-1 overflow-y-auto custom-scrollbar">
        <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* 제목 */}
          <div className="mb-8">
            <NoteTitleInput
              value={localTitle}
              onChange={handleTitleChange}
              placeholder="제목 없음"
            />
          </div>

          {/* 본문 */}
          <div className="prose prose-lg max-w-none">
            <NoteContentEditor
              content={localContent}
              onChange={handleContentChange}
              onEditorReady={setEditor}
              editable
              showMobileToolbar={false}
            />
          </div>
        </div>
      </main>

      {/* 하단 푸터 */}
      <footer className="flex-shrink-0 h-10 border-t border-border-light dark:border-border-dark bg-white dark:bg-surface-dark">
        <div className="h-full px-4 flex items-center justify-between text-xs text-text-muted-light dark:text-text-muted-dark">
          <div className="flex items-center gap-3">
            <span>{stats.charCount.toLocaleString()}자</span>
            <span>•</span>
            <span className="hidden sm:inline">{stats.wordCount.toLocaleString()}단어</span>
          </div>

          <div className="flex items-center gap-2">
            <div
              className={`w-2 h-2 rounded-full ${
                isSaving
                  ? "bg-yellow-500 animate-pulse"
                  : saved
                    ? "bg-green-500"
                    : "bg-red-500"
              }`}
            />
            <span className="hidden sm:inline">
              {isSaving ? "저장 중..." : saved ? "저장됨" : "저장 안됨"}
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}