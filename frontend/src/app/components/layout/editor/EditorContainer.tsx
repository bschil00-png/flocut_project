// src/app/components/editor/EditorContainer.tsx
"use client";

import { useEffect, useState } from "react";
import EditorToolbar from "./EditorToolbar";
import EditorFooter from "./EditorFooter";
import TiptapEditor from "./TiptapEditor";

interface Props {
  noteId: string;
  onAIAction: (m: any) => void;
  onToggleRightPanel: () => void;
  rightPanelOpen: boolean;
}

export default function EditorContainer({
                                          noteId,
                                          onAIAction,
                                          onToggleRightPanel,
                                          rightPanelOpen
                                        }: Props) {

  const [isEditing, setEditing] = useState(true);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  useEffect(() => {
    const mock: any = {
      "1": { title: "3월 마케팅 회의", content: "<p>회의록</p>" },
      "2": { title: "FloCut 기획 정리", content: "<p>MVP 정의</p>" },
      "3": { title: "개발 일정 정리", content: "<p>스프린트 구성</p>" },
    };
    const d = mock[noteId] ?? { title: "새 노트", content: "" };
    setTitle(d.title);
    setContent(d.content);
  }, [noteId]);

  return (
    <div className="flex-1 flex flex-col bg-background-light dark:bg-background-dark">

      <EditorToolbar
        isEditing={isEditing}
        onToggleEdit={() => setEditing(!isEditing)}
        editorContent={content}
        onAIAction={onAIAction}
        onToggleRightPanel={onToggleRightPanel}
        rightPanelOpen={rightPanelOpen}
      />

      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-16 py-10">

          {isEditing ? (
            <input
              className="w-full text-5xl font-bold mb-6 bg-transparent outline-none"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          ) : (
            <h1 className="text-5xl font-bold mb-6">{title}</h1>
          )}

          <TiptapEditor
            content={content}
            editable={isEditing}
            onContentChangeAction={setContent}
          />



        </div>
      </div>

      <EditorFooter content={content} />
    </div>
  );
}
