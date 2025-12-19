"use client";

import { Editor } from "@tiptap/react";
import {
    Bold,
    Italic,
    Underline as UnderlineIcon,
    Strikethrough,
    Code,
    Heading1,
    Heading2,
    Heading3,
    List,
    ListOrdered,
    Quote,
    Minus,
    AlignLeft,
    AlignCenter,
    AlignRight,
    Highlighter,
} from "lucide-react";

interface EditorFormattingToolbarProps {
    editor: Editor | null;
}

export default function EditorFormattingToolbar({ editor }: EditorFormattingToolbarProps) {
    if (!editor) return null;

    const ToolbarButton = ({
                               onClick,
                               isActive,
                               children,
                               title,
                           }: {
        onClick: () => void;
        isActive?: boolean;
        children: React.ReactNode;
        title: string;
    }) => (
        <button
            type="button"
            onClick={onClick}
            title={title}
            className={`
        p-2 rounded-lg transition-all
        ${
                isActive
                    ? "bg-accent text-white"
                    : "hover:bg-surface-light dark:hover:bg-surface-hover text-text-primary-light dark:text-text-primary-dark"
            }
      `}
        >
            {children}
        </button>
    );

    return (
        <div className="flex items-center gap-1 p-2 bg-surface-light dark:bg-surface-dark border-b border-border-light dark:border-border-dark">
            {/* 텍스트 스타일 */}
            <div className="flex items-center gap-1 pr-2 border-r border-border-light dark:border-border-dark">
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    isActive={editor.isActive("bold")}
                    title="굵게 (Ctrl+B)"
                >
                    <Bold size={18} />
                </ToolbarButton>

                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    isActive={editor.isActive("italic")}
                    title="기울임 (Ctrl+I)"
                >
                    <Italic size={18} />
                </ToolbarButton>

                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleUnderline().run()}
                    isActive={editor.isActive("underline")}
                    title="밑줄 (Ctrl+U)"
                >
                    <UnderlineIcon size={18} />
                </ToolbarButton>

                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleStrike().run()}
                    isActive={editor.isActive("strike")}
                    title="취소선"
                >
                    <Strikethrough size={18} />
                </ToolbarButton>

                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleCode().run()}
                    isActive={editor.isActive("code")}
                    title="인라인 코드"
                >
                    <Code size={18} />
                </ToolbarButton>
            </div>

            {/* 제목 */}
            <div className="flex items-center gap-1 px-2 border-r border-border-light dark:border-border-dark">
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                    isActive={editor.isActive("heading", { level: 1 })}
                    title="제목 1"
                >
                    <Heading1 size={18} />
                </ToolbarButton>

                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                    isActive={editor.isActive("heading", { level: 2 })}
                    title="제목 2"
                >
                    <Heading2 size={18} />
                </ToolbarButton>

                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                    isActive={editor.isActive("heading", { level: 3 })}
                    title="제목 3"
                >
                    <Heading3 size={18} />
                </ToolbarButton>
            </div>

            {/* 리스트 */}
            <div className="flex items-center gap-1 px-2 border-r border-border-light dark:border-border-dark">
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                    isActive={editor.isActive("bulletList")}
                    title="글머리 기호"
                >
                    <List size={18} />
                </ToolbarButton>

                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleOrderedList().run()}
                    isActive={editor.isActive("orderedList")}
                    title="번호 매기기"
                >
                    <ListOrdered size={18} />
                </ToolbarButton>

                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleBlockquote().run()}
                    isActive={editor.isActive("blockquote")}
                    title="인용"
                >
                    <Quote size={18} />
                </ToolbarButton>
            </div>

            {/* 정렬 */}
            <div className="flex items-center gap-1 px-2 border-r border-border-light dark:border-border-dark">
                <ToolbarButton
                    onClick={() => editor.chain().focus().setTextAlign("left").run()}
                    isActive={editor.isActive({ textAlign: "left" })}
                    title="왼쪽 정렬"
                >
                    <AlignLeft size={18} />
                </ToolbarButton>

                <ToolbarButton
                    onClick={() => editor.chain().focus().setTextAlign("center").run()}
                    isActive={editor.isActive({ textAlign: "center" })}
                    title="가운데 정렬"
                >
                    <AlignCenter size={18} />
                </ToolbarButton>

                <ToolbarButton
                    onClick={() => editor.chain().focus().setTextAlign("right").run()}
                    isActive={editor.isActive({ textAlign: "right" })}
                    title="오른쪽 정렬"
                >
                    <AlignRight size={18} />
                </ToolbarButton>
            </div>

            {/* 하이라이트 & 색상 */}
            <div className="flex items-center gap-1 px-2">
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleHighlight({ color: "#fef08a" }).run()}
                    isActive={editor.isActive("highlight")}
                    title="형광펜"
                >
                    <Highlighter size={18} />
                </ToolbarButton>

                <ToolbarButton
                    onClick={() => editor.chain().focus().setHorizontalRule().run()}
                    isActive={false}
                    title="구분선"
                >
                    <Minus size={18} />
                </ToolbarButton>
            </div>

            {/* 텍스트 색상 선택 */}
            <div className="flex items-center gap-1 pl-2 ml-2 border-l border-border-light dark:border-border-dark">
                {["#000000", "#ef4444", "#3b82f6", "#22c55e", "#a855f7", "#f59e0b"].map((color) => (
                    <button
                        key={color}
                        type="button"
                        onClick={() => editor.chain().focus().setColor(color).run()}
                        className={`
              w-6 h-6 rounded border-2 transition-all
              ${
                            editor.isActive("textStyle", { color })
                                ? "border-accent scale-110"
                                : "border-border-light dark:border-border-dark hover:scale-110"
                        }
            `}
                        style={{ backgroundColor: color }}
                        title={`텍스트 색상: ${color}`}
                    />
                ))}
            </div>
        </div>
    );
}