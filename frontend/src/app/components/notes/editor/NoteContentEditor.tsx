// components/notes/editor/NoteContentEditor.tsx
"use client";

import { Editor } from "@tiptap/react";
import TiptapEditor from "./TiptapEditor";

interface NoteContentEditorProps {
  content: string;
  onChange: (content: string) => void;
  onEditorReady?: (editor: Editor) => void;
  placeholder?: string;
  editable?: boolean;
  showMobileToolbar?: boolean;
}

export default function NoteContentEditor({
                                            content,
                                            onChange,
                                            onEditorReady,
                                            placeholder = "내용을 입력하세요...",
                                            editable = true,
                                            showMobileToolbar = false,
                                          }: NoteContentEditorProps) {
  return (
    <TiptapEditor
      content={content}
      onChange={onChange}
      placeholder={placeholder}
      onReady={onEditorReady}
      editable={editable}
      showMobileToolbar={showMobileToolbar}
    />
  );
}