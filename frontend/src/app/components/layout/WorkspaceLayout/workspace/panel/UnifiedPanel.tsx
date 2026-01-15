"use client";

import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import PanelHeader, { PanelTab } from "./PanelHeader";
import PanelFooter from "./PanelFooter";
import NoteContent from "@/app/components/notes/NoteContent";
import DocumentContent from "@/app/components/documents/DocumentContent";
import NoteSummaryContent from "@/app/components/notes/NoteSummaryContent";
import DocumentSummaryContent from "@/app/components/documents/DocumentSummaryContent";
import CompareComingSoon from "./CompareComingSoon";
import { useFileText } from "@/hooks/files/useFileText";

type UnifiedPanelProps = {
  type: "note" | "document" | "audio";
  id: string;
  sessionId: number;
  fileName?: string;
  onClose: () => void;
  onCreated?: (noteId: number) => void;
  onUpdated?: (payload?: {
    noteId: number;
    title: string;
    moddate: string;
  }) => void;
  isMobile?: boolean;
};

export default function UnifiedPanel({
                                       type,
                                       id,
                                       sessionId,
                                       fileName,
                                       onClose,
                                       onCreated,
                                       onUpdated,
                                       isMobile = false,
                                     }: UnifiedPanelProps) {
  const [currentTab, setCurrentTab] = useState<PanelTab>("edit");
  const [saved, setSaved] = useState(true);
  const [saving, setSaving] = useState(false);
  const [charCount, setCharCount] = useState(0);
  const [wordCount, setWordCount] = useState(0);
  const [title, setTitle] = useState("제목 없음");
  const [content, setContent] = useState("");

  const handleSyncRef = useRef<(() => Promise<void>) | null>(null);

  const { text: documentText } = useFileText(
    type === "document" ? Number(id) : null
  );

  useEffect(() => {
    setCurrentTab("edit");
    if (type === "document") {
      setTitle(fileName ? fileName.replace(/\.[^/.]+$/, "") : "문서");
      setContent(documentText || "");
    } else if (type === "audio") {
      setTitle("음성");
      setContent("");
    }
  }, [id, type, documentText, fileName]);

  // 수동 저장: 버튼 클릭 시 즉시 리스트 정렬 및 제목 갱신
  const handleSave = async () => {
    if (!handleSyncRef.current) return;
    await handleSyncRef.current();

    if (type === "note" && id !== "new") {
      onUpdated?.({
        noteId: Number(id),
        title,
        moddate: new Date().toISOString(),
      });
    }
  };


  const handleClosePanel = useCallback(() => {
    if (type === "note" && id !== "new") {
      // 인자 없이 호출하여 forceRefetch만 발생시킴 (순환 참조 방지)
      onUpdated?.();
    }
    // 부모의 패널 닫기 로직 실행
    onClose();
  }, [onClose, onUpdated, type, id]);

  const handleNoteCreatedFromSummary = useCallback(() => {
    onUpdated?.({
      noteId: 0,
      title: "새 노트",
      moddate: new Date().toISOString(),
    });
  }, [onUpdated]);

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
      onTitleChange: (newTitle: string) => {
        setTitle(newTitle || "제목 없음");
      },
      onContentChange: (newContent: string) => {
        setContent(newContent);
      },
      onSyncReady: (syncFn: () => Promise<void>) => {
        handleSyncRef.current = syncFn;
      },
    }),
    [id, sessionId, onCreated]
  );

  return (
    <div className="h-full flex flex-col bg-white dark:bg-surface-dark">
      <PanelHeader
        type={type}
        currentTab={currentTab}
        onChangeTab={setCurrentTab}
        saved={saved}
        saving={saving}
        onSave={handleSave}
        onClose={handleClosePanel} // 기존 onClose 대신 handleClosePanel 연결
        sessionId={sessionId}
        noteId={id !== "new" ? Number(id) : undefined}
        title={title}
        content={content}
        isMobile={isMobile}
      />

      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {currentTab === "edit" && (
          <div className="h-full bg-white dark:bg-background-dark">
            {type === "note" && (
              <NoteContent key={`note-edit-${id}`} {...noteContentProps} />
            )}
            {type === "document" && (
              <DocumentContent fileId={id} sessionId={sessionId} />
            )}
          </div>
        )}

        {currentTab === "summary" && (
          <div className="p-4">
            {type === "note" && (
              <NoteSummaryContent
                noteId={id}
                sessionId={sessionId}
                onNoteCreated={handleNoteCreatedFromSummary}
              />
            )}
            {type === "document" && (
              <DocumentSummaryContent
                fileId={Number(id)}
                sessionId={sessionId}
                onNoteCreated={handleNoteCreatedFromSummary}
              />
            )}
          </div>
        )}

        {currentTab === "compare" && (
          <div className="h-full">
            <CompareComingSoon />
          </div>
        )}
      </div>

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