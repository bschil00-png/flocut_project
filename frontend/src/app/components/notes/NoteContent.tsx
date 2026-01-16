"use client";

import { useState, useEffect, memo, useRef } from "react";
import { Loader2, Mic, Sparkles, FileText } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { useNoteCreate } from "@/hooks/notes/useNoteCreate";
import { useNoteEditor } from "@/hooks/notes/useNoteEditor";
import { requestNoteSummary } from "@/lib/rest/summary/summary.rest";

import IconButton from "../ui/icon-button/IconButton";
import Button from "../ui/button/Button";
import NoteTitleInput from "@/app/components/notes/editor/NoteTitleInput";
import NoteContentEditor from "@/app/components/notes/editor/NoteContentEditor";
import VoiceRecorderPanel from "@/app/components/audio/VoiceRecorderPanel";
import ConfirmDialog from "@/app/components/ui/modal/ConfirmDialog";

type Props = {
  id: string;
  sessionId: number;
  onCreated?: (noteId: number) => void;
  onSaveStatusChange?: (saved: boolean, saving: boolean) => void;
  onStatsChange?: (chars: number, words: number) => void;
  onTitleChange?: (title: string) => void;
  onContentChange?: (content: string) => void;
  onSyncReady?: (fn: () => Promise<void>) => void;
};

function NoteContent({
                       id,
                       sessionId,
                       onCreated,
                       onSaveStatusChange,
                       onStatsChange,
                       onTitleChange,
                       onContentChange,
                       onSyncReady,
                     }: Props) {
  const router = useRouter();
  const isNew = id === "new";

  const [noteId, setNoteId] = useState<number | undefined>(
    isNew ? undefined : Number(id)
  );
  const [showVoiceRecorder, setShowVoiceRecorder] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false); // 컨펌 모달 상태 추가
  const [summaryLoading, setSummaryLoading] = useState(false);

  const { handleCreate, isCreating } = useNoteCreate(sessionId);

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
    refetch,
  } = useNoteEditor(noteId);

  const creatingOnceRef = useRef(false);

  // 상위 컴포넌트와 상태 동기화
  useEffect(() => {
    if (handleSync) onSyncReady?.(handleSync);
  }, [handleSync, onSyncReady]);

  useEffect(() => {
    onSaveStatusChange?.(saved, isSaving);
  }, [saved, isSaving, onSaveStatusChange]);

  useEffect(() => {
    onStatsChange?.(stats.charCount, stats.wordCount);
  }, [stats, onStatsChange]);

  useEffect(() => {
    onTitleChange?.(localTitle);
  }, [localTitle, onTitleChange]);

  useEffect(() => {
    if (editor) {
      const text = editor.getText();
      onContentChange?.(text);
    }
  }, [localContent, editor, onContentChange]);

  // 새 노트 자동 생성 로직
  useEffect(() => {
    if (!isNew || isCreating || noteId || creatingOnceRef.current) return;

    creatingOnceRef.current = true;
    handleCreate().then((newId) => {
      setNoteId(newId);
      onCreated?.(newId);
      router.replace(
        `/workspace/${sessionId}?type=note&id=${newId}`,
        { scroll: false }
      );
    });
  }, [isNew, isCreating, noteId, handleCreate, onCreated, sessionId, router]);

  const handleTranscriptReady = (text: string) => {
    if (!editor || !text.trim()) return;

    editor.chain().focus().insertContent(`\n\n${text}`).run();
    handleContentChange(editor.getHTML());
    refetch?.();
  };

  // 요약 요청 실제 실행
  const executeSummaryRequest = async () => {
    if (!noteId) return;
    setIsConfirmOpen(false);
    setSummaryLoading(true);

    try {
      await requestNoteSummary(noteId);
      toast.success("노트 요약 요청이 접수되었습니다.");
    } catch {
      toast.error("요약 요청에 실패했습니다.");
    } finally {
      setSummaryLoading(false);
    }
  };

  // 로딩 상태 (중앙 정렬)
  if (loading || isCreating) {
    return (
      <div className="h-full flex flex-col items-center justify-center bg-background-light dark:bg-background-dark">
        <Loader2 className="animate-spin text-accent" size={32} />
        <p className="mt-4 text-sm text-text-muted-light">노트를 구성하는 중입니다...</p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col overflow-hidden bg-background-light dark:bg-background-dark">
      {/* 상단 툴바 영역 */}
      <div className="flex-shrink-0 flex items-center justify-between px-6 py-3 border-b border-border-light dark:border-border-dark bg-white dark:bg-surface-dark shadow-sm">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-md bg-accent-soft text-accent">
            <FileText size={16} />
          </div>
          <span className="text-sm font-medium text-text-muted-light dark:text-text-muted-dark">노트 편집기</span>
        </div>

        {noteId && (
          <div className="flex items-center gap-2">
            <IconButton
              icon={<Mic size={16} />}
              onClick={() => setShowVoiceRecorder(true)}
              aria-label="음성 녹음 시작"
              className="hover:text-accent"
            />

            <Button
              size="sm"
              variant="primary"
              loading={summaryLoading}
              onClick={() => setIsConfirmOpen(true)}
            >
              <Sparkles size={14} />
              요약 요청
            </Button>
          </div>
        )}
      </div>

        {/* 에디터 메인 영역 */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden bg-white dark:bg-background-dark">
            <div className="max-w-4xl w-full min-w-0 mx-auto px-8 sm:px-12 lg:px-16 py-10">
                <NoteTitleInput
                    value={localTitle}
                    onChange={handleTitleChange}
                />

                <div className="mt-8">
                    <NoteContentEditor
                        content={localContent}
                        onChange={handleContentChange}
                        onEditorReady={setEditor}
                    />
                </div>
            </div>
        </div>


        {/* 음성 녹음 패널 */}
      {showVoiceRecorder && (
        <VoiceRecorderPanel
          open={showVoiceRecorder}
          onClose={() => setShowVoiceRecorder(false)}
          onTranscriptReady={handleTranscriptReady}
        />
      )}

      {/* 요약 요청 컨펌 다이얼로그 */}
      {isConfirmOpen && (
        <>
          {/*<ModalOverlay onClose={() => setIsConfirmOpen(false)} />*/}
          <ConfirmDialog
            open={isConfirmOpen}
            title="노트 요약 생성"
            message="현재 작성된 노트를 바탕으로 AI 요약을 생성하시겠습니까? 기존에 생성된 요약이 있다면 덮어씌워집니다."
            confirmText="요약 시작"
            cancelText="취소"
            onConfirm={executeSummaryRequest}
            onClose={() => setIsConfirmOpen(false)}
          />
        </>
      )}
    </div>
  );
}

export default memo(NoteContent);