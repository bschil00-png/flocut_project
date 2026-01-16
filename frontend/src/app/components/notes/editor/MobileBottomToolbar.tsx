"use client";

import { Editor } from "@tiptap/react";
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  List,
  ListOrdered,
  Heading1,
  Heading2,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Undo,
  Redo,
} from "lucide-react";

interface MobileBottomToolbarProps {
  editor: Editor;
  height: number;
}

export default function MobileBottomToolbar({
                                              editor,
                                              height,
                                            }: MobileBottomToolbarProps) {
  const ToolButton = ({
                        onClick,
                        isActive,
                        icon: Icon,
                        label,
                      }: {
    onClick: () => void;
    isActive?: boolean;
    icon: any;
    label: string;
  }) => (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className={`
                p-2 rounded flex-shrink-0 transition-colors
                ${
        isActive
          ? "bg-accent text-white"
          : "hover:bg-accent-soft text-text-primary-light dark:text-text-primary-dark"
      }
            `}
    >
      <Icon size={18} />
    </button>
  );

  return (
    <div
      className="
                fixed left-0 right-0 z-50
                bg-white dark:bg-surface-dark
                border-t border-border-light dark:border-border-dark
            "
      style={{
        height,
        bottom: "env(safe-area-inset-bottom, 0px)",
      }}
    >
      <div className="h-full flex items-center gap-1 px-2 overflow-x-auto custom-scrollbar-hide">
        <ToolButton
          onClick={() => editor.chain().focus().undo().run()}
          icon={Undo}
          label="실행 취소"
        />
        <ToolButton
          onClick={() => editor.chain().focus().redo().run()}
          icon={Redo}
          label="다시 실행"
        />

        <div className="w-px h-6 bg-border-light dark:bg-border-dark mx-1" />

        <ToolButton
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()
          }
          isActive={editor.isActive("heading", { level: 1 })}
          icon={Heading1}
          label="제목 1"
        />
        <ToolButton
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          isActive={editor.isActive("heading", { level: 2 })}
          icon={Heading2}
          label="제목 2"
        />

        <div className="w-px h-6 bg-border-light dark:bg-border-dark mx-1" />

        <ToolButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          isActive={editor.isActive("bold")}
          icon={Bold}
          label="굵게"
        />
        <ToolButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          isActive={editor.isActive("italic")}
          icon={Italic}
          label="기울임"
        />
        <ToolButton
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          isActive={editor.isActive("underline")}
          icon={UnderlineIcon}
          label="밑줄"
        />

        <div className="w-px h-6 bg-border-light dark:bg-border-dark mx-1" />

        <ToolButton
          onClick={() =>
            editor.chain().focus().toggleBulletList().run()
          }
          isActive={editor.isActive("bulletList")}
          icon={List}
          label="글머리"
        />
        <ToolButton
          onClick={() =>
            editor.chain().focus().toggleOrderedList().run()
          }
          isActive={editor.isActive("orderedList")}
          icon={ListOrdered}
          label="번호"
        />

        <div className="w-px h-6 bg-border-light dark:bg-border-dark mx-1" />

        <ToolButton
          onClick={() =>
            editor.chain().focus().setTextAlign("left").run()
          }
          isActive={editor.isActive({ textAlign: "left" })}
          icon={AlignLeft}
          label="왼쪽"
        />
        <ToolButton
          onClick={() =>
            editor.chain().focus().setTextAlign("center").run()
          }
          isActive={editor.isActive({ textAlign: "center" })}
          icon={AlignCenter}
          label="가운데"
        />
        <ToolButton
          onClick={() =>
            editor.chain().focus().setTextAlign("right").run()
          }
          isActive={editor.isActive({ textAlign: "right" })}
          icon={AlignRight}
          label="오른쪽"
        />
      </div>
    </div>
  );
}
