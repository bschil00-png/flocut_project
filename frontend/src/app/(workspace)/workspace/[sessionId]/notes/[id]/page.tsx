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
        stats,
        refetch,
    } = useNoteEditor(noteId);

    // 신규 노트 생성
    useEffect(() => {
        if (!isNew || isCreating || noteId || creatingRef.current) return;

        creatingRef.current = true;

        handleCreate().then((newNoteId) => {
            setNoteId(newNoteId);
            router.replace(`/workspace/${sessionId}/notes/${newNoteId}`);
        });
    }, [isNew, isCreating, noteId, handleCreate, sessionId, router]);

    //  뒤로가기: 즉시 이동 (자동 저장 신뢰)
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
            <div className="h-screen flex items-center justify-center bg-white dark:bg-surface-dark">
                <Loader2 className="animate-spin text-accent" size={48} />
            </div>
        );
    }

    return (
        <div className="h-screen flex bg-white dark:bg-surface-dark">
            {/* 메인 에디터 */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* 헤더 */}
                <header className="h-14 border-b border-border-light dark:border-border-dark flex items-center justify-between px-4 sm:px-6 bg-white dark:bg-surface-dark">
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                        <button
                            onClick={handleBackClick}
                            className="p-2 hover:bg-accent-soft rounded-lg"
                            aria-label="뒤로가기"
                        >
                            <ArrowLeft size={18} />
                        </button>
                        <h1 className="text-sm font-medium truncate">
                            {localTitle || "제목 없음"}
                        </h1>
                    </div>

                    <div className="flex items-center gap-2">
                        {noteId && (
                            <button
                                onClick={() => setShowVoiceRecorder(true)}
                                className="p-2 hover:bg-accent-soft rounded-lg"
                            >
                                <Mic size={16} />
                            </button>
                        )}

                        {noteId && (
                            <button
                                onClick={handleRequestSummary}
                                disabled={summaryLoading}
                                className="flex items-center gap-2 px-3 py-1.5 text-sm rounded-lg bg-accent text-white"
                            >
                                {summaryLoading ? (
                                    <Loader2 size={14} className="animate-spin" />
                                ) : (
                                    <Sparkles size={14} />
                                )}
                                <span className="hidden sm:inline">요약 요청</span>
                            </button>
                        )}

                        {noteId && (
                            <button
                                onClick={() => setShowSummary(!showSummary)}
                                className={`p-2 rounded-lg ${
                                    showSummary
                                        ? "bg-accent text-white"
                                        : "hover:bg-accent-soft"
                                }`}
                            >
                                {showSummary ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                        )}

                        <div className="relative">
                            <button
                                onClick={() => setShowDownload(!showDownload)}
                                className="p-2 hover:bg-accent-soft rounded-lg"
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

                        {!saved && !isSaving && (
                            <button
                                onClick={handleSync}
                                className="flex items-center gap-2 px-3 py-1.5 text-sm rounded-lg bg-accent text-white"
                            >
                                <Save size={14} />
                                <span className="hidden sm:inline">저장</span>
                            </button>
                        )}
                    </div>
                </header>

                <FullPageToolbar editor={editor} />

                {/* 에디터 */}
                <main className="flex-1 overflow-y-auto px-4 sm:px-8 lg:px-12 py-8">
                    <div className="max-w-5xl mx-auto">
                        <div className="mb-8">
                            <NoteTitleInput
                                value={localTitle}
                                onChange={handleTitleChange}
                                placeholder="제목을 입력하세요"
                            />
                        </div>

                        <NoteContentEditor
                            content={localContent}
                            onChange={handleContentChange}
                            onEditorReady={setEditor}
                            editable
                            showMobileToolbar={false}
                        />
                    </div>
                </main>
            </div>

            {/* 요약 패널 */}
            {showSummary && noteId && (
                <div className="w-96 border-l flex flex-col bg-white dark:bg-surface-dark">
                    <div className="p-4 border-b flex justify-between">
                        <h2 className="font-bold text-sm flex items-center gap-2">
                            <Sparkles size={16} className="text-accent" />
                            요약
                        </h2>
                        <button onClick={() => setShowSummary(false)}>닫기</button>
                    </div>
                    <NoteSummaryContent noteId={id} sessionId={Number(sessionId)} />
                </div>
            )}

            {showVoiceRecorder && (
                <VoiceRecorder
                    open
                    onClose={() => setShowVoiceRecorder(false)}
                    onTranscriptReady={handleTranscriptReady}
                />
            )}
        </div>
    );
}
