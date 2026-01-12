// src/app/components/notes/NoteContent.tsx
"use client";

import { useState, useEffect, memo, useRef } from "react";
import { Loader2, Mic, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { useNoteCreate } from "@/hooks/notes/useNoteCreate";
import { useNoteEditor } from "@/hooks/notes/useNoteEditor";
import { requestNoteSummary } from "@/lib/rest/summary/summary.rest";

import VoiceRecorder from "../audio/VoiceRecorder";
import IconButton from "../ui/icon-button/IconButton";
import Button from "../ui/button/Button";
import NoteTitleInput from "@/app/components/notes/editor/NoteTitleInput";
import NoteContentEditor from "@/app/components/notes/editor/NoteContentEditor";

type Props = {
    id: string;
    sessionId: number;
    onCreated?: (noteId: number) => void;
    onSaveStatusChange?: (saved: boolean, saving: boolean) => void;
    onStatsChange?: (chars: number, words: number) => void;
    onTitleChange?: (title: string) => void;
    onContentChange?: (content: string) => void; //  추가
    onSyncReady?: (fn: () => Promise<void>) => void;
};

function NoteContent({
                         id,
                         sessionId,
                         onCreated,
                         onSaveStatusChange,
                         onStatsChange,
                         onTitleChange,
                         onContentChange, //  추가
                         onSyncReady,
                     }: Props) {
    const router = useRouter();
    const isNew = id === "new";

    const [noteId, setNoteId] = useState<number | undefined>(
        isNew ? undefined : Number(id)
    );
    const [showVoiceRecorder, setShowVoiceRecorder] = useState(false);
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

    //  에디터 내용 변경 시 상위로 전달
    useEffect(() => {
        if (editor) {
            const text = editor.getText();
            onContentChange?.(text);
        }
    }, [localContent, editor, onContentChange]);

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
    }, [
        isNew,
        isCreating,
        noteId,
        handleCreate,
        onCreated,
        sessionId,
        router,
    ]);

    const handleTranscriptReady = (text: string) => {
        if (!editor || !text.trim()) return;

        editor
            .chain()
            .focus()
            .insertContent(`\n\n${text}`)
            .run();

        handleContentChange(editor.getHTML());
        refetch?.();
    };

    const handleRequestSummary = async () => {
        if (!noteId) return;

        setSummaryLoading(true);
        try {
            await requestNoteSummary(noteId);
            toast.success("노트 요약 요청이 접수되었습니다.");
        } catch {
            toast.error("요약 요청 실패");
        } finally {
            setSummaryLoading(false);
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
        <div className="h-full flex flex-col overflow-hidden">
            {/* 상단 툴바 */}
            <div className="flex-shrink-0 flex items-center gap-2 px-4 py-2 border-b">
                {noteId && (
                    <>
                        <IconButton
                            icon={<Mic size={14} />}
                            onClick={() => setShowVoiceRecorder(true)}
                            aria-label="음성 녹음"
                        />

                        <Button
                            size="sm"
                            variant="secondary"
                            loading={summaryLoading}
                            onClick={handleRequestSummary}
                        >
                            <Sparkles size={14} />
                            요약 요청
                        </Button>
                    </>
                )}
            </div>

            {/* 에디터 */}
            <div className="flex-1 overflow-y-auto px-6 py-6">
                <NoteTitleInput
                    value={localTitle}
                    onChange={handleTitleChange}
                    placeholder="제목 없음"
                />
                <NoteContentEditor
                    content={localContent}
                    onChange={handleContentChange}
                    onEditorReady={setEditor}
                    editable
                    showMobileToolbar
                />
            </div>

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

export default memo(NoteContent);