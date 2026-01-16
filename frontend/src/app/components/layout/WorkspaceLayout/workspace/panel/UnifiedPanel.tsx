"use client";

import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { useDispatch } from "react-redux";
import {
  setEditingNote,
  setEditingFile,
  clearEditor,
} from "@/store/slice/editorSlice";

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
  const dispatch = useDispatch();

  const [currentTab, setCurrentTab] = useState<PanelTab>("edit");
  const [saved, setSaved] = useState(true);
  const [saving, setSaving] = useState(false);
  const [charCount, setCharCount] = useState(0);
  const [wordCount, setWordCount] = useState(0);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const handleSyncRef = useRef<(() => Promise<void>) | null>(null);

  const { text: documentText } = useFileText(
    type === "document" ? Number(id) : null
  );

  /* ===============================
   * 요약 → 노트 생성 콜백 (🔥 누락됐던 핵심)
   * =============================== */
  const handleNoteCreatedFromSummary = useCallback(
    (noteId: number) => {
      // 부모 Workspace에 새 노트 생성 알림
      onCreated?.(noteId);

      // 요약 탭 → 편집 탭 전환
      setCurrentTab("edit");
    },
    [onCreated]
  );

  /* ===============================
   * 초기 데이터 동기화
   * =============================== */
  useEffect(() => {
    setCurrentTab("edit");

    if (type === "document") {
      if (fileName && fileName.trim() !== "") {
        const cleanTitle = fileName.replace(/\.[^/.]+$/, "");
        setTitle(cleanTitle);
        setContent(documentText || "");
        dispatch(setEditingFile({ fileId: Number(id), title: cleanTitle }));
      }
    } else if (type === "audio") {
      const audioTitle = "음성 기록";
      setTitle(audioTitle);
      dispatch(setEditingFile({ fileId: Number(id), title: audioTitle }));
    } else if (type === "note") {
      dispatch(
        setEditingNote({ noteId: Number(id), title: title || "제목 없음" })
      );
    }
  }, [id, type, documentText, fileName, dispatch]);

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
      onUpdated?.();
    }
    dispatch(clearEditor());
    onClose();
  }, [onClose, onUpdated, type, id, dispatch]);

  const handleTitleChange = useCallback(
    (newTitle: string) => {
      const finalTitle = newTitle || "제목 없음";
      setTitle(finalTitle);

      if (type === "note") {
        dispatch(setEditingNote({ noteId: Number(id), title: finalTitle }));
      } else {
        dispatch(setEditingFile({ fileId: Number(id), title: finalTitle }));
      }
    },
    [dispatch, id, type]
  );

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
      onTitleChange: handleTitleChange,
      onContentChange: (newContent: string) => setContent(newContent),
      onSyncReady: (syncFn: () => Promise<void>) => {
        handleSyncRef.current = syncFn;
      },
    }),
    [id, sessionId, onCreated, handleTitleChange]
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
        onClose={handleClosePanel}
        sessionId={sessionId}
        noteId={id !== "new" ? Number(id) : undefined}
        title={title || fileName?.replace(/\.[^/.]+$/, "") || "파일 읽는 중..."}
        content={content}
        isMobile={isMobile}
      />

      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {currentTab === "edit" && (
          <div className="h-full">
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

        {currentTab === "compare" && <CompareComingSoon />}
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
