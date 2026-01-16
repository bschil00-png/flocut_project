"use client";

import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Save,
  Loader2,
  Download,
  Sparkles,
  Mic,
  Eye,
  EyeOff,
  X
} from "lucide-react";
import { useNoteEditor } from "@/hooks/notes/useNoteEditor";
import { useNoteCreate } from "@/hooks/notes/useNoteCreate";
import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";

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
    refetch,
  } = useNoteEditor(noteId);

  // 신규 노트 생성 로직
  useEffect(() => {
    if (!isNew || isCreating || noteId || creatingRef.current) return;
    creatingRef.current = true;
    handleCreate().then((newNoteId) => {
      setNoteId(newNoteId);
      router.replace(`/workspace/${sessionId}/notes/${newNoteId}`);
    });
  }, [isNew, isCreating, noteId, handleCreate, sessionId, router]);

  const handleBackClick = () => {
    router.push(`/workspace/${sessionId}/notes`);
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
      <div className="h-screen flex items-center justify-center bg-white dark:bg-background-dark">
        <Loader2 className="animate-spin text-accent" size={48} />
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-white dark:bg-background-dark overflow-hidden">
      {/* 헤더: 모든 조작 버튼 복구 */}
      <header className="h-14 flex-shrink-0 border-b border-border-light dark:border-border-dark flex items-center justify-between px-4 sm:px-6 bg-white dark:bg-surface-dark z-20">
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <button onClick={handleBackClick} className="p-2 hover:bg-accent-soft rounded-lg transition-colors">
            <ArrowLeft size={18} />
          </button>
          <h1 className="text-sm font-semibold truncate text-text-primary-light dark:text-text-primary-dark">
            {localTitle || "제목 없음"}
          </h1>
        </div>

        <div className="flex items-center gap-2">
          {noteId && (
            <button onClick={() => setShowVoiceRecorder(true)} className="p-2 hover:bg-accent-soft rounded-lg text-text-muted-light">
              <Mic size={16} />
            </button>
          )}

          {/* 요약 요청 버튼 복구 */}
          {noteId && (
            <button
              onClick={handleRequestSummary}
              disabled={summaryLoading}
              className="flex items-center gap-2 px-3 py-1.5 text-sm rounded-lg bg-accent text-white hover:bg-accent-hover transition-colors disabled:opacity-50"
            >
              {summaryLoading ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
              <span className="hidden sm:inline">요약 요청</span>
            </button>
          )}

          {/* 요약 패널 토글 버튼 복구 */}
          {noteId && (
            <button
              onClick={() => setShowSummary(!showSummary)}
              className={`p-2 rounded-lg transition-colors ${
                showSummary ? "bg-accent text-white" : "hover:bg-accent-soft text-text-muted-light"
              }`}
            >
              {showSummary ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          )}

          {/* 다운로드 메뉴 복구 */}
          <div className="relative">
            <button onClick={() => setShowDownload(!showDownload)} className="p-2 hover:bg-accent-soft rounded-lg text-text-muted-light">
              <Download size={16} />
            </button>
            {showDownload && (
              <DownloadMenu data={downloadData} onClose={() => setShowDownload(false)} />
            )}
          </div>

          <button
            onClick={handleSync}
            disabled={isSaving || saved}
            className={`flex items-center justify-center gap-2 px-4 py-1.5 text-sm font-medium rounded-lg min-w-[100px] transition-all
              ${saved ? "bg-surface-light text-text-muted-light cursor-default" : "bg-accent text-white hover:bg-accent-dark"}
              ${isSaving ? "opacity-80 cursor-wait" : ""}`}
          >
            {isSaving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
            <span className="hidden sm:inline">{isSaving ? "저장 중…" : saved ? "저장됨" : "저장"}</span>
          </button>
        </div>
      </header>

      {/* 메인 영역 */}
      <div className="flex-1 flex min-h-0 overflow-hidden">
        <div className="flex-1 flex flex-col min-w-0 bg-white dark:bg-background-dark">
          <FullPageToolbar editor={editor} />
          <main className="flex-1 overflow-y-auto custom-scrollbar px-4 sm:px-8 lg:px-12 py-10">
            <div className="max-w-4xl mx-auto">
              <NoteTitleInput value={localTitle} onChange={handleTitleChange} />
              <div className="mt-6">
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
        </div>

        {/* 요약 패널 복구 */}
        {showSummary && noteId && (
          <aside className="w-96 border-l border-border-light dark:border-border-dark flex flex-col bg-white dark:bg-surface-dark animate-fadeIn">
            <div className="p-4 border-b flex items-center justify-between">
              <h2 className="font-bold text-sm flex items-center gap-2 text-text-primary-light">
                <Sparkles size={16} className="text-accent" /> AI 요약 결과
              </h2>
              <button onClick={() => setShowSummary(false)} className="p-1 hover:bg-accent-soft rounded"><X size={16} /></button>
            </div>
            <div className="flex-1 overflow-y-auto">
              <NoteSummaryContent noteId={id} sessionId={Number(sessionId)} />
            </div>
          </aside>
        )}
      </div>

      {showVoiceRecorder && (
        <VoiceRecorder open onClose={() => setShowVoiceRecorder(false)} onTranscriptReady={handleTranscriptReady} />
      )}
    </div>
  );
}