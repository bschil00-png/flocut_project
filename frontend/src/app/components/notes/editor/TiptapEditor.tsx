"use client";

import { useEditor, EditorContent, Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Placeholder from "@tiptap/extension-placeholder";
import Link from "@tiptap/extension-link";
import Highlight from "@tiptap/extension-highlight";
import Image from "@tiptap/extension-image";

import { Color } from "@tiptap/extension-color";

import { useEffect, useMemo, useState } from "react";
import { useMediaQuery } from "@/hooks/common/useMediaQuery";
import BubbleMenuToolbar from "./BubbleMenuToolbar";
import MobileBottomToolbar from "./MobileBottomToolbar";
import {TextStyle} from "@tiptap/extension-text-style";

const DEFAULT_HIGHLIGHT = "#fff3a0";

export default function TiptapEditor({
                                       content,
                                       onChange,
                                       placeholder = "내용을 입력하세요...",
                                       editable = true,
                                       onReady,
                                       showMobileToolbar = true,
                                     }: any) {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => setIsMounted(true), []);

  const extensions = useMemo(() => [
    StarterKit.configure({
      heading: { levels: [1, 2, 3] },
      bulletList: { keepMarks: true },
      orderedList: { keepMarks: true },
    }),
    Underline,
    TextStyle,
    Color,
    Highlight.configure({ multicolor: true }),
    TextAlign.configure({ types: ["heading", "paragraph"] }),
    Link.configure({ openOnClick: false, autolink: true }),
    Image.configure({ inline: false, allowBase64: true }),
    Placeholder.configure({ placeholder }),
  ], [placeholder]);

  const editor = useEditor({
    immediatelyRender: false,
    extensions,
    content,
    editable,
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
    editorProps: {
      attributes: { class: "ProseMirror focus:outline-none min-h-[500px]" },
      handleKeyDown(view, event) {
        const isMac = navigator.platform.toLowerCase().includes("mac");
        const mod = isMac ? event.metaKey : event.ctrlKey;

        // 형광펜 단축키 에러 가드 적용
        if (mod && event.shiftKey && event.key.toLowerCase() === "h") {
          event.preventDefault();
          const ed = (view as any).editor as Editor;
          if (ed) {
            ed.chain().focus().toggleHighlight({ color: DEFAULT_HIGHLIGHT }).run();
            return true;
          }
        }
        return false;
      },
    },
  });

  useEffect(() => {
    if (editor && onReady) onReady(editor);
  }, [editor, onReady]);

  // 커서 유지를 위한 외부 content 동기화 로직
  useEffect(() => {
    if (!editor || content === editor.getHTML()) return;
    const { from, to } = editor.state.selection;
    editor.commands.setContent(content, { emitUpdate: false });
    const maxPos = editor.state.doc.content.size;
    editor.commands.setTextSelection({
      from: Math.min(from, maxPos),
      to: Math.min(to, maxPos),
    });
  }, [content, editor]);

  if (!isMounted || !editor) return null;

  return (
    <div className="tiptap-wrapper w-full overflow-hidden">
      {editable && <BubbleMenuToolbar editor={editor} />}
      <div className="tiptap-editor-shell">
        <EditorContent editor={editor} />
      </div>
      {editable && showMobileToolbar && isMobile && (
        <MobileBottomToolbar editor={editor} height={56} />
      )}
    </div>
  );
}