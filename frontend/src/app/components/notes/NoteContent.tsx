"use client";

import {useEffect, useState, memo, useRef} from "react";
import { Loader2, Mic } from "lucide-react";
import { useRouter } from "next/navigation";

import { useNoteCreate } from "@/hooks/notes/useNoteCreate";
import { useNoteEditor } from "@/hooks/notes/useNoteEditor";

import NoteTitleInput from "./editor/NoteTitleInput";
import NoteContentEditor from "./editor/NoteContentEditor";
import VoiceRecorder from "../ai/VoiceRecorder";
import IconButton from "../ui/icon-button/IconButton";

type NoteContentProps = {
  id: string;
  sessionId: number;
  onCreated?: (noteId: number) => void;
  onSaveStatusChange?: (saved: boolean, saving: boolean) => void;
  onStatsChange?: (charCount: number, wordCount: number) => void;
  onTitleChange?: (title: string) => void;
  onSyncReady?: (syncFn: () => Promise<void>) => void;
};

function NoteContent({
                       id,
                       sessionId,
                       onCreated,
                       onSaveStatusChange,
                       onStatsChange,
                       onTitleChange,
                       onSyncReady,
                     }: NoteContentProps) {
  const router = useRouter();
  const isNew = id === "new";

  const [noteId, setNoteId] = useState<number | undefined>(
    isNew ? undefined : Number(id)
  );

  const [showVoiceRecorder, setShowVoiceRecorder] = useState(false);

  const { handleCreate, isCreating } = useNoteCreate(sessionId);
  const {
    note,
    loading,
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
  } = useNoteEditor(noteId);

    //   중복 생성 방지용
    const creatingOnceRef = useRef(false);

    // 부모에서 저장 버튼을 쓰기 위해 sync 함수 전달
    useEffect(() => {
        if (handleSync) {
            onSyncReady?.(handleSync);
        }
    }, [handleSync, onSyncReady]);

    // 저장 상태 변경 전달
    useEffect(() => {
        onSaveStatusChange?.(saved, isSaving);
    }, [saved, isSaving, onSaveStatusChange]);

    // 통계 전달
    useEffect(() => {
        onStatsChange?.(stats.charCount, stats.wordCount);
    }, [stats, onStatsChange]);

    // 제목 변경 전달
    useEffect(() => {
        onTitleChange?.(localTitle);
    }, [localTitle, onTitleChange]);

  //  신규 노트 생성
    useEffect(() => {
        if (!isNew) return;
        if (isCreating) return;
        if (noteId) return;
        if (creatingOnceRef.current) return;

        creatingOnceRef.current = true;

        handleCreate().then((newNoteId) => {
            // 내부 상태 업데이트
            setNoteId(newNoteId);

            // 부모(UnifiedWorkspacePage)에게 알림 → 리스트 refetch 용
            onCreated?.(newNoteId);

            // URL을 실제 noteId로 교체 (히스토리 오염 방지)
            router.replace(
                `/workspace/${sessionId}?type=note&id=${newNoteId}`,
                { scroll: false }
            );
        });
    }, [isNew, isCreating, noteId, handleCreate, onCreated, sessionId, router]);

    const handleTranscriptionComplete = (text: string) => {
        if (editor) {
            editor.chain().focus().insertContent(text).run();
        }
    };

    if (loading || isCreating) {
        return (
            <div className="h-full flex items-center justify-center">
                <Loader2 className="animate-spin text-accent" size={32} />
            </div>
        );
    }

    return (
        <>
            <div className="h-full flex flex-col overflow-hidden">
                <div className="flex items-center justify-between px-4 py-2 border-b border-border-light dark:border-border-dark bg-white dark:bg-surface-dark">
                    <div className="flex items-center gap-2">
                        <IconButton
                            icon={<Mic size={14} />}
                            onClick={() => setShowVoiceRecorder(true)}
                            aria-label="음성 녹음"
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto px-6 py-4">
                    <NoteTitleInput
                        value={localTitle}
                        onChange={handleTitleChange}
                        placeholder="제목 없음"
                    />

                    <NoteContentEditor
                        content={localContent}
                        onChange={handleContentChange}
                        onEditorReady={setEditor}
                        editable={true}
                        showMobileToolbar={true}
                    />
                </div>
            </div>

            {showVoiceRecorder && (
                <VoiceRecorder
                    onClose={() => setShowVoiceRecorder(false)}
                    onTranscriptionComplete={handleTranscriptionComplete}
                />
            )}
        </>
    );
}

export default memo(NoteContent, (prev, next) => {
    return prev.id === next.id && prev.sessionId === next.sessionId;
});