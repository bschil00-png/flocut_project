"use client";

import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Save, Loader2, Download, Sparkles, Mic, Eye, EyeOff } from "lucide-react";
import { useNoteEditor } from "@/hooks/notes/useNoteEditor";
import { useNoteCreate } from "@/hooks/notes/useNoteCreate";
import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";

import { useUnsavedLeaveGuard } from "@/hooks/common/useUnsavedLeaveGuard";
import { requestNoteSummary } from "@/lib/rest/summary/summary.rest";

import NoteTitleInput from "@/app/components/notes/editor/NoteTitleInput";
import NoteContentEditor from "@/app/components/notes/editor/NoteContentEditor";
import FullPageToolbar from "@/app/components/notes/editor/FullPageToolbar";
import DownloadMenu from "@/app/components/notes/download/DownloadMenu";
import NoteSummaryContent from "@/app/components/notes/NoteSummaryContent";
import VoiceRecorder from "@/app/components/audio/VoiceRecorder";
import { DownloadData } from "@/app/components/notes/download/types";

export default function NoteDetailPage() {
  const router = useRouter();
  const { sessionId, id } = useParams<{ sessionId: string; id: string }>();

  const isNew = id === "new";
  const [noteId, setNoteId] = useState<number | undefined>(
    isNew ? undefined : Number(id)
  );
  const [showDownload, setShowDownload] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [showVoiceRecorder, setShowVoiceRecorder] = useState(false);
  const [summaryLoading, setSummaryLoading] = useState(false);

  const creatingRef = useRef(false);

  const { handleCreate, isCreating } = useNoteCreate(Number(sessionId));
  const {
    loading,
    localTitle,
    localContent,
    handleTitleChange,
    handleContentChange,
    editor,
    setEditor,
    saved,
    isSaving,
    handleSync,
    stats,
    refetch,
  } = useNoteEditor(noteId);

  const { confirmNavigation } = useUnsavedLeaveGuard(
    !saved && !isSaving,
    handleSync
  );

  useEffect(() => {
    if (!isNew || isCreating || noteId || creatingRef.current) return;

    creatingRef.current = true;

    handleCreate().then((newNoteId) => {
      setNoteId(newNoteId);
      router.replace(`/workspace/${sessionId}/notes/${newNoteId}`);
    });
  }, [isNew, isCreating, noteId, handleCreate, sessionId, router]);

  const handleBackClick = () => {
    confirmNavigation(() => {
      router.push(`/workspace/${sessionId}/notes`);
    });
  };

  const handleRequestSummary = async () => {
    if (!noteId) return;

    setSummaryLoading(true);
    try {
      await requestNoteSummary(noteId);
      toast.success("노트 요약 요청이 접수되었습니다.");
      setShowSummary(true);
    } catch {
      toast.error("요약 요청 실패");
    } finally {
      setSummaryLoading(false);
    }
  };

  const handleTranscriptReady = (text: string) => {
    if (!editor || !text.trim()) return;

    editor.chain().focus().insertContent(`\n\n${text}`).run();
    handleContentChange(editor.getHTML());
    refetch?.();
  };

  const downloadData: DownloadData = {
    title: localTitle || "제목 없음",
    content: editor?.getText() || "",
    htmlContent: localContent,
  };

  if (loading || isCreating) {
    return (
      <div className="h-screen flex items-center justify-center bg-white dark:bg-surface-dark">
        <Loader2 className="animate-spin text-accent" size={48} />
      </div>
    );
  }

  return (
    <div className="h-screen flex bg-white dark:bg-surface-dark">
      {/* 메인 에디터 영역 */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* 상단 헤더 */}
        <header className="h-14 border-b border-border-light dark:border-border-dark flex items-center justify-between px-4 sm:px-6 flex-shrink-0 bg-white dark:bg-surface-dark">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <button
              onClick={handleBackClick}
              className="flex-shrink-0 p-2 hover:bg-accent-soft rounded-lg transition-colors text-text-primary-light dark:text-text-primary-dark"
              aria-label="뒤로가기"
            >
              <ArrowLeft size={18} />
            </button>
            <h1 className="text-sm font-medium text-text-primary-light dark:text-text-primary-dark truncate">
              {localTitle || "제목 없음"}
            </h1>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            {/* 음성 녹음 */}
            {noteId && (
              <button
                onClick={() => setShowVoiceRecorder(true)}
                className="p-2 hover:bg-accent-soft rounded-lg transition-colors text-text-primary-light dark:text-text-primary-dark"
                aria-label="음성 녹음"
              >
                <Mic size={16} />
              </button>
            )}

            {/* 요약 요청 */}
            {noteId && (
              <button
                onClick={handleRequestSummary}
                disabled={summaryLoading}
                className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-lg bg-accent text-white hover:bg-accent-hover transition-all disabled:opacity-50"
              >
                {summaryLoading ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : (
                  <Sparkles size={14} />
                )}
                <span className="hidden sm:inline">요약 요청</span>
              </button>
            )}

            {/* 요약 패널 토글 */}
            {noteId && (
              <button
                onClick={() => setShowSummary(!showSummary)}
                className={`p-2 rounded-lg transition-colors ${
                  showSummary
                    ? "bg-accent text-white"
                    : "hover:bg-accent-soft text-text-primary-light dark:text-text-primary-dark"
                }`}
                aria-label={showSummary ? "요약 패널 닫기" : "요약 패널 열기"}
              >
                {showSummary ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            )}

            {/* 다운로드 */}
            <div className="relative">
              <button
                onClick={() => setShowDownload(!showDownload)}
                className="p-2 hover:bg-accent-soft rounded-lg transition-colors text-text-primary-light dark:text-text-primary-dark"
                aria-label="다운로드"
              >
                <Download size={16} />
              </button>
              {showDownload && (
                <DownloadMenu
                  data={downloadData}
                  onClose={() => setShowDownload(false)}
                />
              )}
            </div>

            {/* 저장 */}
            {isSaving ? (
              <div className="flex items-center gap-2 px-3 py-1.5 text-sm text-accent">
                <Loader2 size={14} className="animate-spin" />
                <span className="hidden sm:inline">저장 중...</span>
              </div>
            ) : saved ? (
              <div className="flex items-center gap-2 px-3 py-1.5 text-sm text-green-500">
                <div className="w-2 h-2 rounded-full bg-green-500" />
                <span className="hidden sm:inline">저장됨</span>
              </div>
            ) : (
              <button
                onClick={handleSync}
                className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-lg bg-accent text-white hover:bg-accent-hover transition-all"
              >
                <Save size={14} />
                <span className="hidden sm:inline">저장</span>
              </button>
            )}
          </div>
        </header>

        {/* 툴바 */}
        <FullPageToolbar editor={editor} />

        {/* 에디터 */}
        <main className="flex-1 overflow-y-auto px-4 sm:px-8 lg:px-12 py-8 custom-scrollbar">
          <div className="w-full max-w-5xl mx-auto">
            {/* 제목 */}
            <div className="mb-8">
              <NoteTitleInput
                value={localTitle}
                onChange={handleTitleChange}
                placeholder="제목을 입력하세요"
              />
            </div>

            {/* 본문 */}
            <div className="prose prose-lg max-w-none">
              <NoteContentEditor
                content={localContent}
                onChange={handleContentChange}
                onEditorReady={setEditor}
                editable={true}
                showMobileToolbar={false}
              />
            </div>
          </div>
        </main>

        {/* 푸터 */}
        <footer className="h-10 border-t border-border-light dark:border-border-dark flex items-center justify-between px-4 sm:px-6 text-xs text-text-muted-light dark:text-text-muted-dark flex-shrink-0 bg-white dark:bg-surface-dark">
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
        </footer>
      </div>

      {/* 요약 사이드 패널 */}
      {showSummary && noteId && (
        <div className="w-96 border-l border-border-light dark:border-border-dark flex-shrink-0 bg-white dark:bg-surface-dark overflow-hidden flex flex-col">
          <div className="flex items-center justify-between p-4 border-b border-border-light dark:border-border-dark">
            <h2 className="font-bold text-sm flex items-center gap-2">
              <Sparkles size={16} className="text-accent" />
              요약
            </h2>
            <button
              onClick={() => setShowSummary(false)}
              className="text-sm text-text-muted-light dark:text-text-muted-dark hover:text-text-primary-light dark:hover:text-text-primary-dark transition-colors"
            >
              닫기
            </button>
          </div>
          <div className="flex-1 overflow-hidden">
            <NoteSummaryContent noteId={id} sessionId={Number(sessionId)} />
          </div>
        </div>
      )}

      {/* 음성 녹음 모달 */}
      {showVoiceRecorder && (
        <VoiceRecorder
          open={showVoiceRecorder}
          onClose={() => setShowVoiceRecorder(false)}
          onTranscriptReady={handleTranscriptReady}
        />
      )}
    </div>
  );
}