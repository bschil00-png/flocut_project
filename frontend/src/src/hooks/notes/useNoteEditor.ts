"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { Editor } from "@tiptap/react";

import { useNoteDetail } from "./useNoteDetail";
import { useNoteUpdate } from "./useNoteUpdate";
import { useAutoSave } from "./useAutoSave";
import { setEditingNote, updateLocalTitle } from "@/store/slice/editorSlice";

export function useNoteEditor(noteId?: number) {
  const dispatch = useDispatch();
  const { note, loading, error, refetch } = useNoteDetail(noteId);
  const { autoSave, sync, isSaving, lastSaved } = useNoteUpdate(noteId);

  const [localTitle, setLocalTitle] = useState("");
  const [localContent, setLocalContent] = useState("");
  const [editor, setEditor] = useState<Editor | null>(null);
  const [saved, setSaved] = useState(true);

  const isInitialLoaded = useRef(false);

  useEffect(() => {
    if (note && !isInitialLoaded.current) {
      const initialTitle = note.title ?? "";
      setLocalTitle(initialTitle);
      setLocalContent(note.content ?? "");
      setSaved(true);
      isInitialLoaded.current = true;
      if (noteId) dispatch(setEditingNote({ noteId, title: initialTitle }));
    }
  }, [note, noteId, dispatch]);

  useEffect(() => { isInitialLoaded.current = false; }, [noteId]);

  // 자동 저장: 백그라운드에서만 수행 (refetch를 부르지 않아 깜빡임 제거)
  useAutoSave(async (data) => {
    if (!noteId) return;
    await autoSave(data);
    setSaved(true);
    //  목록을 다시 리로딩하지 않음
  }, { title: localTitle, content: localContent }, 2000);

  const handleTitleChange = useCallback((value: string) => {
    setLocalTitle(value);
    setSaved(false);
    // 리덕스 업데이트로 목록 제목 즉시 반영
    dispatch(updateLocalTitle(value));
  }, [dispatch]);

  const handleContentChange = useCallback((html: string) => {
    setLocalContent(html);
    setSaved(false);
  }, []);

  const handleSync = useCallback(async () => {
    if (!noteId) return;
    try {
      await sync({ title: localTitle, content: localContent });
      setSaved(true);
      await refetch(); // 수동 저장 시에만 명시적 새로고침
    } catch (err) { console.error(err); }
  }, [noteId, sync, localTitle, localContent, refetch]);

  const stats = {
    charCount: editor?.getText().length ?? 0,
    wordCount: editor?.getText().trim().split(/\s+/).filter(Boolean).length ?? 0,
  };

  return { note, loading, localTitle, localContent, handleTitleChange, handleContentChange, editor, setEditor, saved, isSaving, handleSync, stats, refetch };
}