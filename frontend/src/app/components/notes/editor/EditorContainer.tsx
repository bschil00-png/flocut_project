"use client";

import { useEffect, useState } from "react";
import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import EditorToolbar from "./EditorToolbar";
import EditorFormattingToolbar from "./EditorFormattingToolbar";
import EditorFooter from "./EditorFooter";
import TiptapEditor from "./TiptapEditor";
import { Loader2 } from "lucide-react";
import {createNote, updateNote} from "@/lib/rest/note/notes.api";
import {useNoteDetail} from "@/hooks/note/useNoteDetail";


interface Props {
  noteId: string;
  sessionId: number;
  isNew: boolean;
  onCreated: (noteId: number) => void;
  onAIAction: (mode: "summary" | "feedback" | "compare") => void;
  onToggleRightPanel: () => void;
  rightPanelOpen: boolean;
}

export default function EditorContainer({
                                          noteId,
                                          sessionId,
                                          isNew,
                                          onCreated,
                                          onAIAction,
                                          onToggleRightPanel,
                                          rightPanelOpen,
                                        }: Props) {
  const [isEditing, setEditing] = useState(true);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [saving, setSaving] = useState(false);

  // 기존 노트 조회 (new면 스킵)
  const { note, loading } = useNoteDetail(
    isNew ? undefined: Number(noteId)
  );

  // 기존 노트 로드
  useEffect(() => {
    if (!note || isNew) return;
    setTitle(note.title);
    setContent(note.content ?? "<p></p>");
  }, [note, isNew]);

  // 에디터 초기화
  const editor = useEditor({
    content,
    extensions: [StarterKit],
    immediatelyRender: false,
    onUpdate({ editor }) {
      setContent(editor.getHTML());
    },
  });


  // 저장 로직
  const handleSave = async () => {
    if (saving) return;
    setSaving(true);

    try {
      if (isNew) {
        // 새 노트 생성
        const newNoteId = await createNote({
          sessionId,
          title: title || "제목 없음",
          content,
        });
        onCreated(newNoteId);
      } else {
        // 기존 노트 수정
        await updateNote({
          noteId: Number(noteId),
          title,
          content,
        });
      }
    } finally {
      setSaving(false);
    }
  };

  if (!isNew && loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <Loader2 className="animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <EditorToolbar
        isEditing={isEditing}
        onToggleEdit={() => setEditing(!isEditing)}
        editorContent={content}
        onAIAction={onAIAction}
        onToggleRightPanel={onToggleRightPanel}
        rightPanelOpen={rightPanelOpen}
        onSave={handleSave} // 저장 버튼 연결
        saving={saving}
      />

      {isEditing && <EditorFormattingToolbar editor={editor} />}

      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto py-8">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="제목 없음"
            className="w-full text-5xl font-bold bg-transparent outline-none mb-6"
          />

          <TiptapEditor
            content={content}
            editable={isEditing}
            onContentChange={setContent}
          />
        </div>
      </div>

      <EditorFooter content={content} />
    </div>
  );
}
