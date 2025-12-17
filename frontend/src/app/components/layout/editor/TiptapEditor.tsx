"use client";

import { useEffect, useState } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

export default function TiptapEditor({
                                       content,
                                       editable,
                                       onContentChange   // <- 이름 변경
                                     }: {
  content: string;
  editable: boolean;
  onContentChange: (value: string) => void;
}) {

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const editor = useEditor({
    editable,
    content,
    immediatelyRender: false,
    extensions: [StarterKit],
    onUpdate({ editor }) {
      onContentChange(editor.getHTML());
    }
  });

  if (!mounted) return null;

  return (
    <div className="prose dark:prose-invert max-w-none">
      <EditorContent editor={editor} />
    </div>
  );
}
