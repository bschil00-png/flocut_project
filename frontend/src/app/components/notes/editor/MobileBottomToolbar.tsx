// src/app/components/notes/editor/MobileBottomToolbar.tsx
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
}

export default function MobileBottomToolbar({ editor }: MobileBottomToolbarProps) {
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
            onClick={onClick}
            className={`
        p-2 rounded transition-colors flex-shrink-0
        ${
                isActive
                    ? "bg-accent text-white"
                    : "hover:bg-accent-soft text-text-primary-light dark:text-text-primary-dark"
            }
      `}
            aria-label={label}
        >
            <Icon size={18} />
        </button>
    );

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-surface-dark border-t border-border-light dark:border-border-dark shadow-lg z-40">
            <div className="flex items-center gap-1 p-2 overflow-x-auto">
                {/* Undo/Redo */}
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

                {/* Headings */}
                <ToolButton
                    onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                    isActive={editor.isActive("heading", { level: 1 })}
                    icon={Heading1}
                    label="제목 1"
                />
                <ToolButton
                    onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                    isActive={editor.isActive("heading", { level: 2 })}
                    icon={Heading2}
                    label="제목 2"
                />

                <div className="w-px h-6 bg-border-light dark:bg-border-dark mx-1" />

                {/* Text Formatting */}
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

                {/* Lists */}
                <ToolButton
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                    isActive={editor.isActive("bulletList")}
                    icon={List}
                    label="글머리 기호"
                />
                <ToolButton
                    onClick={() => editor.chain().focus().toggleOrderedList().run()}
                    isActive={editor.isActive("orderedList")}
                    icon={ListOrdered}
                    label="번호 매기기"
                />

                <div className="w-px h-6 bg-border-light dark:bg-border-dark mx-1" />

                {/* Alignment */}
                <ToolButton
                    onClick={() => editor.chain().focus().setTextAlign("left").run()}
                    isActive={editor.isActive({ textAlign: "left" })}
                    icon={AlignLeft}
                    label="왼쪽 정렬"
                />
                <ToolButton
                    onClick={() => editor.chain().focus().setTextAlign("center").run()}
                    isActive={editor.isActive({ textAlign: "center" })}
                    icon={AlignCenter}
                    label="가운데 정렬"
                />
                <ToolButton
                    onClick={() => editor.chain().focus().setTextAlign("right").run()}
                    isActive={editor.isActive({ textAlign: "right" })}
                    icon={AlignRight}
                    label="오른쪽 정렬"
                />
            </div>
        </div>
    );
}
