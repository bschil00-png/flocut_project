"use client";

import { Editor } from "@tiptap/react";
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
} from "lucide-react";

import { getFormattingActions } from "./editorFormattingActions";
import {ToolbarButton} from "@/app/components/ui/button";

interface Props {
  editor: Editor;
}

export default function DesktopFormattingToolbar({ editor }: Props) {
  const actions = getFormattingActions(editor);

  return (
    <div className="hidden md:flex flex-wrap items-center gap-1 px-2 py-1">
      <ToolbarButton icon={<Bold size={18} />} onClick={actions.bold} />
      <ToolbarButton icon={<Italic size={18} />} onClick={actions.italic} />
      <ToolbarButton icon={<UnderlineIcon size={18} />} onClick={actions.underline} />

      <ToolbarButton icon={<Heading1 size={18} />} onClick={actions.h1} />
      <ToolbarButton icon={<Heading2 size={18} />} onClick={actions.h2} />
      <ToolbarButton icon={<Heading3 size={18} />} onClick={actions.h3} />

      <ToolbarButton icon={<List size={18} />} onClick={actions.bullet} />
      <ToolbarButton icon={<ListOrdered size={18} />} onClick={actions.ordered} />
      <ToolbarButton icon={<Quote size={18} />} onClick={actions.quote} />
    </div>
  );
}
