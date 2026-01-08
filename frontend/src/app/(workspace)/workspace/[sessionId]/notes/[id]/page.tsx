"use client";

import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import { useNoteEditor } from "@/hooks/notes/useNoteEditor";
import { useNoteCreate } from "@/hooks/notes/useNoteCreate";
import { useState, useEffect, useRef } from "react";

import { useUnsavedLeaveGuard } from "@/hooks/common/useUnsavedLeaveGuard";

import NoteTitleInput from "@/app/components/notes/editor/NoteTitleInput";
import NoteContentEditor from "@/app/components/notes/editor/NoteContentEditor";
import FullPageToolbar from "@/app/components/notes/editor/FullPageToolbar";

export default function NoteDetailPage() {
    const router = useRouter();
    const { sessionId, id } = useParams<{ sessionId: string; id: string }>();

    const isNew = id === "new";
    const [noteId, setNoteId] = useState<number | undefined>(
        isNew ? undefined : Number(id)
    );

    // 중복 생성 방지용 ref
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
    } = useNoteEditor(noteId);

    // 저장 안 된 상태에서 페이지 이탈 방지 가드
    const { confirmNavigation } = useUnsavedLeaveGuard(
        !saved && !isSaving,
        handleSync
    );

    useEffect(() => {
        // new 상태에서 한 번만 생성
        if (!isNew || isCreating || noteId || creatingRef.current) return;

        creatingRef.current = true;

        handleCreate().then((newNoteId) => {
            setNoteId(newNoteId);
            router.replace(`/workspace/${sessionId}/notes/${newNoteId}`);
        });
    }, [isNew, isCreating, noteId, handleCreate, sessionId, router]);

    // 뒤로가기 버튼 클릭 시 가드 적용
    const handleBackClick = () => {
        confirmNavigation(() => {
            router.push(`/workspace/${sessionId}/notes`);
        });
    };

    if (loading || isCreating) {
        return (
            <div className="h-screen flex items-center justify-center bg-white dark:bg-slate-950">
                <Loader2 className="animate-spin text-pink-500" size={48} />
            </div>
        );
    }

    return (
        <div className="h-screen flex flex-col bg-white dark:bg-slate-950">
            <div className="h-14 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-4 sm:px-6 flex-shrink-0">
                <div className="flex items-center gap-3">
                    <button
                        onClick={handleBackClick}
                        className="p-2 hover:bg-slate-100 dark:hover:bg-slate-900 rounded-lg transition-colors"
                    >
                        <ArrowLeft size={18} />
                    </button>
                    <div className="text-xs text-slate-500 dark:text-slate-400">
                        {stats.charCount}자 · {stats.wordCount}단어
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    {isSaving ? (
                        <div className="flex items-center gap-2 text-sm text-pink-500">
                            <Loader2 size={14} className="animate-spin" />
                            <span>저장 중...</span>
                        </div>
                    ) : saved ? (
                        <span className="text-sm text-green-500">저장됨</span>
                    ) : (
                        <button
                            onClick={handleSync}
                            className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-lg bg-gradient-to-r from-pink-500 to-violet-500 text-white hover:shadow-lg transition-all"
                        >
                            <Save size={14} />
                            저장
                        </button>
                    )}
                </div>
            </div>

            <FullPageToolbar editor={editor} />

            <div className="flex-1 overflow-y-auto px-6 sm:px-12 py-8">
                <div className="max-w-4xl mx-auto">
                    <NoteTitleInput
                        value={localTitle}
                        onChange={handleTitleChange}
                        placeholder="제목을 입력하세요"
                    />

                    <NoteContentEditor
                        content={localContent}
                        onChange={handleContentChange}
                        onEditorReady={setEditor}
                        editable={true}
                        showMobileToolbar={false}
                    />
                </div>
            </div>
        </div>
    );
}
