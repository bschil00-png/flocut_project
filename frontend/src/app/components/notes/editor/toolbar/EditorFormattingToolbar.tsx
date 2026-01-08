"use client";

import { Editor } from "@tiptap/react";
import DesktopFormattingToolbar from "./DesktopFormattingToolbar";
import MobileFormattingToolbar from "./MobileFormattingToolbar";

interface Props {
  editor: Editor | null;
}

export default function EditorFormattingToolbar({ editor }: Props) {
  if (!editor) return null;

  return (
    <div className="border-b border-border-light dark:border-border-dark">
      <DesktopFormattingToolbar editor={editor} />
      <MobileFormattingToolbar editor={editor} />
    </div>
  );
}
