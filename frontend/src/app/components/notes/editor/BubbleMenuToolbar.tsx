// src/app/components/notes/editor/BubbleMenuToolbar.tsx
"use client";

import { Editor } from "@tiptap/react"; // @tiptap/react에서 함께 임포트
import {
  Bold, Italic, Underline as UnderlineIcon, Strikethrough, Code, Link as LinkIcon, Highlighter, Type, X
} from "lucide-react";
import { useMemo, useState } from "react";
import {BubbleMenu} from "@tiptap/react/menus";

const TEXT_COLORS = [
  { label: "기본", color: "inherit" },
  { label: "빨강", color: "#e5484d" },
  { label: "파랑", color: "#2563eb" },
  { label: "초록", color: "#16a34a" },
  { label: "보라", color: "#7c3aed" },
];

const HIGHLIGHTS = [
  { label: "노랑", color: "#fff3a0" },
  { label: "초록", color: "#d2f4c5" },
  { label: "파랑", color: "#dbeafe" },
  { label: "핑크", color: "#fce7f3" },
];

export default function BubbleMenuToolbar({ editor }: { editor: Editor }) {
  const [activePanel, setActivePanel] = useState<"none" | "color" | "highlight" | "link">("none");
  const [linkUrl, setLinkUrl] = useState("");

  const canShow = useMemo(() => ({ state }: any) => {
    const { from, to } = state.selection;
    return from !== to;
  }, []);

  return (
    <BubbleMenu editor={editor} shouldShow={canShow} className="bubble-menu-container">
      {/* 메인 툴바 버튼군 */}
      <div className="flex items-center gap-0.5 p-1 rounded-lg border border-border-light dark:border-border-dark bg-white dark:bg-surface-dark shadow-lg">
        <ToolButton icon={<Bold size={16} />} onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive("bold")} />
        <ToolButton icon={<Italic size={16} />} onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive("italic")} />
        <ToolButton icon={<UnderlineIcon size={16} />} onClick={() => editor.chain().focus().toggleUnderline().run()} active={editor.isActive("underline")} />

        <div className="w-px h-5 bg-border-light mx-1" />

        <ToolButton icon={<Type size={16} />} onClick={() => setActivePanel(activePanel === "color" ? "none" : "color")} active={activePanel === "color"} />
        <ToolButton icon={<Highlighter size={16} />} onClick={() => setActivePanel(activePanel === "highlight" ? "none" : "highlight")} active={activePanel === "highlight"} />
        <ToolButton icon={<LinkIcon size={16} />} onClick={() => setActivePanel(activePanel === "link" ? "none" : "link")} active={editor.isActive("link")} />
      </div>

      {/* 하위 패널 영역 (텍스트 컬러 / 형광펜 / 링크) */}
      {activePanel !== "none" && (
        <div className="mt-2 p-2 rounded-lg border border-border-light dark:border-border-dark bg-white dark:bg-surface-dark shadow-lg flex items-center gap-2">
          {activePanel === "color" && TEXT_COLORS.map(c => (
            <button key={c.color} onClick={() => { editor.chain().focus().setColor(c.color === "inherit" ? "" : c.color).run(); setActivePanel("none"); }}
                    className="w-6 h-6 rounded border border-black/10" style={{ backgroundColor: c.color === "inherit" ? "transparent" : c.color }} />
          ))}
          {activePanel === "highlight" && HIGHLIGHTS.map(h => (
            <button key={h.color} onClick={() => { editor.chain().focus().toggleHighlight({ color: h.color }).run(); setActivePanel("none"); }}
                    className="w-6 h-6 rounded border border-black/10" style={{ backgroundColor: h.color }} />
          ))}
          {activePanel === "link" && (
            <div className="flex gap-2">
              <input value={linkUrl} onChange={e => setLinkUrl(e.target.value)} className="text-xs p-1 border rounded bg-transparent" placeholder="https://" />
              <button onClick={() => { editor.chain().focus().setLink({ href: linkUrl }).run(); setActivePanel("none"); }} className="text-xs bg-accent text-white px-2 rounded">확인</button>
            </div>
          )}
        </div>
      )}
    </BubbleMenu>
  );
}

function ToolButton({ icon, onClick, active }: any) {
  return (
    <button type="button" onClick={onClick} className={`p-1.5 rounded transition-colors ${active ? "bg-accent text-white" : "hover:bg-surface-light dark:hover:bg-surface-input"}`}>
      {icon}

    </button>
  );
}