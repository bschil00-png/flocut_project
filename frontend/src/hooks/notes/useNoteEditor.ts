"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { Editor } from "@tiptap/react";

import { useNoteDetail } from "./useNoteDetail";
import { useNoteUpdate } from "./useNoteUpdate";
import { useAutoSave } from "./useAutoSave";

export function useNoteEditor(noteId?: number) {
  const { note, loading, error, refetch } = useNoteDetail(noteId);
  const { autoSave, sync, isSaving, lastSaved } = useNoteUpdate(noteId);

  const [localTitle, setLocalTitle] = useState("");
  const [localContent, setLocalContent] = useState("");
  const [editor, setEditor] = useState<Editor | null>(null);
  const [saved, setSaved] = useState(true);

  const isInitialLoaded = useRef(false);

  useEffect(() => {
    if (note && !isInitialLoaded.current) {
      setLocalTitle(note.title ?? "");
      setLocalContent(note.content ?? "");
      setSaved(true);
      isInitialLoaded.current = true;
    }
  }, [note]);

  useAutoSave(
    async (data) => {
      if (!noteId) return;
      await autoSave(data);
      setSaved(true);
    },
    { title: localTitle, content: localContent },
    2000
  );

  const handleTitleChange = useCallback((value: string) => {
    setLocalTitle(value);
    setSaved(false);
  }, []);

  const handleContentChange = useCallback((html: string) => {
    setLocalContent(html);
    setSaved(false);
  }, []);

  const handleSync = useCallback(async () => {
    if (!noteId) return;

    try {
      await sync({ title: localTitle, content: localContent });
      setSaved(true);
      await refetch();
    } catch (err) {
      console.error("수동 저장 실패:", err);
    }
  }, [noteId, sync, localTitle, localContent, refetch]);

  const stats = {
    charCount: editor?.getText().length ?? 0,
    wordCount: editor?.getText().trim().split(/\s+/).filter(Boolean).length ?? 0,
  };

  return {
    note,
    loading,
    error,
    localTitle,
    localContent,
    handleTitleChange,
    handleContentChange,
    editor,
    setEditor,
    saved,
    isSaving,
    lastSaved,
    handleSync,
    stats,
    refetch,
  };
}