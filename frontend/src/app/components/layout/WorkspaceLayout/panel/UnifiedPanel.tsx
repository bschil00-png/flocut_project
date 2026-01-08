"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import PanelHeader, { PanelTab } from "./PanelHeader";
import PanelFooter from "./PanelFooter";
import NoteContent from "@/app/components/notes/NoteContent";
import CalendarContent from "../CalendarContent";
import CompareComingSoon from "./CompareComingSoon";
import { useUnsavedLeaveGuard } from "@/hooks/common/useUnsavedLeaveGuard";
import DocumentContent from "@/app/components/documents/DocumentContent";

type UnifiedPanelProps = {
    type: "note" | "document" | "audio";
    id: string;
    sessionId: number;
    onClose: () => void;
    onCreated?: (noteId: number) => void;
    onUpdated?: () => void;
};

export default function UnifiedPanel({
                                         type,
                                         id,
                                         sessionId,
                                         onClose,
                                         onCreated,
                                         onUpdated,
                                     }: UnifiedPanelProps) {
    const [currentTab, setCurrentTab] = useState<PanelTab>("edit");
    const [saved, setSaved] = useState(true);
    const [saving, setSaving] = useState(false);
    const [charCount, setCharCount] = useState(0);
    const [wordCount, setWordCount] = useState(0);
    const [title, setTitle] = useState("제목 없음");

    const handleSyncRef = useRef<(() => Promise<void>) | null>(null);
    const prevSavingRef = useRef(saving);

    // ID 변경 시 항상 edit 탭으로
    useEffect(() => {
        setCurrentTab("edit");
    }, [id]);

    // 수동 저장
    const handleSave = async () => {
        if (!handleSyncRef.current) return;
        await handleSyncRef.current();
        onUpdated?.();
    };

    // 저장 안 된 상태에서 닫기 방지
    const { confirmNavigation } = useUnsavedLeaveGuard(
        !saved && !saving,
        handleSave
    );

    const handleCloseWithGuard = () => {
        confirmNavigation(() => {
            onClose();
        });
    };

    // 자동 저장 완료 감지 → 리스트 갱신
    useEffect(() => {
        if (prevSavingRef.current && !saving && saved) {
            onUpdated?.();
        }
        prevSavingRef.current = saving;
    }, [saving, saved, onUpdated]);

    const noteContentProps = useMemo(
        () => ({
            id,
            sessionId,
            onCreated,
            onSaveStatusChange: (s: boolean, sv: boolean) => {
                setSaved(s);
                setSaving(sv);
            },
            onStatsChange: (chars: number, words: number) => {
                setCharCount(chars);
                setWordCount(words);
            },
            onTitleChange: (newTitle: string) =>
                setTitle(newTitle || "제목 없음"),
            onSyncReady: (syncFn: () => Promise<void>) => {
                handleSyncRef.current = syncFn;
            },
        }),
        [id, sessionId, onCreated]
    );

    return (
        <div className="h-full flex flex-col bg-white dark:bg-surface-dark transition-all duration-300">
            <PanelHeader
                type={type}
                currentTab={currentTab}
                onChangeTab={setCurrentTab}
                saved={saved}
                saving={saving}
                onSave={handleSave}
                onClose={handleCloseWithGuard}
                sessionId={sessionId}
                noteId={id !== "new" ? Number(id) : undefined}
            />

            {/* 핵심: 얇은 커스텀 스크롤바가 적용된 영역 */}
            <div className="flex-1 overflow-y-auto custom-scrollbar">
                {/* 노트 편집 */}
                {currentTab === "edit" && type === "note" && (
                    <NoteContent key={`${sessionId}-${id}`} {...noteContentProps} />
                )}

                {/* 문서 컨텐츠 */}
                {currentTab === "edit" && type === "document" && (
                    <DocumentContent fileId={id} sessionId={sessionId} />
                )}

                {currentTab === "summary" && <SummaryContent id={id} type={type} />}
                {currentTab === "feedback" && <FeedbackContent id={id} />}
                {currentTab === "compare" && <CompareComingSoon />}
                {currentTab === "calendar" && type === "note" && (
                    <CalendarContent noteId={id} />
                )}
            </div>

            {/* 노트일 때만 Footer 표시 */}
            {type === "note" && (
                <PanelFooter
                    saved={saved}
                    saving={saving}
                    charCount={charCount}
                    wordCount={wordCount}
                />
            )}
        </div>
    );
}

// SummaryContent: 반응형 여백 조정 및 텍스트 꺾임 방지 적용
function SummaryContent({ id, type }: { id: string; type: string }) {
    return (
        <div className="p-4 sm:p-6 lg:p-8 animate-fadeIn">
            <div className="flex items-center gap-2 mb-4 shrink-0">
                <div className="w-1 h-4 bg-accent rounded-full" />
                <h3 className="text-lg font-bold text-text-primary-light dark:text-text-primary-dark whitespace-nowrap">AI 요약</h3>
            </div>
            <p className="text-sm text-text-muted-light dark:text-text-muted-dark leading-relaxed">
                {type === "document"
                    ? "문서 요약 기능 준비 중입니다."
                    : "요약 기능 준비 중입니다."}
            </p>
        </div>
    );
}

// FeedbackContent: 반응형 여백 조정
function FeedbackContent({ id }: { id: string }) {
    return (
        <div className="p-4 sm:p-6 lg:p-8 animate-fadeIn">
            <div className="flex items-center gap-2 mb-4 shrink-0">
                <div className="w-1 h-4 bg-accent rounded-full" />
                <h3 className="text-lg font-bold text-text-primary-light dark:text-text-primary-dark whitespace-nowrap">AI 피드백</h3>
            </div>
            <p className="text-sm text-text-muted-light dark:text-text-muted-dark leading-relaxed">
                피드백 기능 준비 중입니다.
            </p>
        </div>
    );
}