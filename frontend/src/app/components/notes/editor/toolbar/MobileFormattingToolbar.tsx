"use client";

import { useState } from "react";
import { Editor } from "@tiptap/react";
import { Bold, Italic, Plus } from "lucide-react";

import { getFormattingActions } from "./editorFormattingActions";
import {ToolbarButton} from "@/app/components/ui/button";

interface Props {
  editor: Editor;
}

export default function MobileFormattingToolbar({ editor }: Props) {
  const actions = getFormattingActions(editor);
  const [open, setOpen] = useState(false);

  return (
    <div className="flex md:hidden items-center gap-1 px-2 py-1">
      <ToolbarButton icon={<Bold size={18} />} onClick={actions.bold} />
      <ToolbarButton icon={<Italic size={18} />} onClick={actions.italic} />

      <ToolbarButton
        icon={<Plus size={18} />}
        onClick={() => setOpen((prev) => !prev)}
      />

      {open && (
        <div className="absolute bottom-14 left-2 right-2 p-2 rounded-lg border bg-white dark:bg-slate-900 shadow-lg">
          <ToolbarButton icon={<Bold size={18} />} onClick={actions.bold} />
          <ToolbarButton icon={<Italic size={18} />} onClick={actions.italic} />
          <ToolbarButton icon={<Plus size={18} />} onClick={actions.h1} />
        </div>
      )}
    </div>
  );
}
