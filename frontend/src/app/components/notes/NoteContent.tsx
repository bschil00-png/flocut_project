"use client";

import { useEffect, useState, memo, useRef } from "react";
import { Loader2, Mic } from "lucide-react";
import { useRouter } from "next/navigation";
import { useNoteCreate } from "@/hooks/notes/useNoteCreate";
import { useNoteEditor } from "@/hooks/notes/useNoteEditor";
import NoteTitleInput from "./editor/NoteTitleInput";
import NoteContentEditor from "./editor/NoteContentEditor";
import VoiceRecorder from "../ai/VoiceRecorder";
import IconButton from "../ui/icon-button/IconButton";

function NoteContent({ id, sessionId, onCreated, onSaveStatusChange, onStatsChange, onTitleChange, onSyncReady }: any) {
    const router = useRouter();
    const isNew = id === "new";
    const [noteId, setNoteId] = useState<number | undefined>(isNew ? undefined : Number(id));
    const [showVoiceRecorder, setShowVoiceRecorder] = useState(false);
    const { handleCreate, isCreating } = useNoteCreate(sessionId);
    const { localTitle, localContent, handleTitleChange, handleContentChange, editor, setEditor, saved, isSaving, stats, handleSync, loading } = useNoteEditor(noteId);
    const creatingOnceRef = useRef(false);

    useEffect(() => { if (handleSync) onSyncReady?.(handleSync); }, [handleSync, onSyncReady]);
    useEffect(() => { onSaveStatusChange?.(saved, isSaving); }, [saved, isSaving, onSaveStatusChange]);
    useEffect(() => { onStatsChange?.(stats.charCount, stats.wordCount); }, [stats, onStatsChange]);
    useEffect(() => { onTitleChange?.(localTitle); }, [localTitle, onTitleChange]);

    useEffect(() => {
        if (!isNew || isCreating || noteId || creatingOnceRef.current) return;
        creatingOnceRef.current = true;
        handleCreate().then((newId) => {
            setNoteId(newId);
            onCreated?.(newId);
            router.replace(`/workspace/${sessionId}?type=note&id=${newId}`, { scroll: false });
        });
    }, [isNew, isCreating, noteId, handleCreate, onCreated, sessionId, router]);

    if (loading || isCreating) return (
        <div className="h-full flex items-center justify-center bg-background-light dark:bg-background-dark">
            <Loader2 className="animate-spin text-accent" size={32} />
        </div>
    );

    return (
        <div className="h-full flex flex-col overflow-hidden bg-background-light dark:bg-background-dark">
            {/* 상단 툴바 고정 */}
            <div className="flex-shrink-0 flex items-center justify-between px-4 py-2 border-b border-border-light dark:border-border-dark bg-white dark:bg-surface-dark">
                <div className="flex items-center gap-2">
                    <IconButton icon={<Mic size={14} />} onClick={() => setShowVoiceRecorder(true)} aria-label="음성 녹음" />
                </div>
            </div>

            {/* 에디터 내부 스크롤 보장 */}
            <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar px-6 py-6 lg:px-10">
                <NoteTitleInput value={localTitle} onChange={handleTitleChange} placeholder="제목 없음" />
                <div className="flex-1 min-h-0">
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
                <VoiceRecorder onClose={() => setShowVoiceRecorder(false)} onTranscriptionComplete={(text) => editor?.chain().focus().insertContent(text).run()} />
            )}
        </div>
    );
}

export default memo(NoteContent);