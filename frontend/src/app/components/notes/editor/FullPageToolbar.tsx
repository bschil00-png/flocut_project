"use client";

import { Editor } from "@tiptap/react";
import { LucideIcon } from "lucide-react";
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
    AlignLeft,
    AlignCenter,
    AlignRight,
    Highlighter,
    Link as LinkIcon,
    Image as ImageIcon,
    Minus,
    Undo,
    Redo,
    X,
} from "lucide-react";
import { useState } from "react";

type FullPageToolbarProps = {
    editor: Editor | null;
};

export default function FullPageToolbar({ editor }: FullPageToolbarProps) {
    const [linkUrl, setLinkUrl] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    const [showLinkInput, setShowLinkInput] = useState(false);
    const [showImageInput, setShowImageInput] = useState(false);

    if (!editor) return null;

    /* --------------------------------------------
     * Handlers
     * -------------------------------------------- */

    const handleSetLink = () => {
        if (!linkUrl.trim()) return;
        editor.chain().focus().setLink({ href: linkUrl.trim() }).run();
        setLinkUrl("");
        setShowLinkInput(false);
    };

    const handleRemoveLink = () => {
        editor.chain().focus().unsetLink().run();
        setLinkUrl("");
        setShowLinkInput(false);
    };

    const handleAddImage = () => {
        if (!imageUrl.trim()) return;
        editor
            .chain()
            .focus()
            .insertContent({
                type: "image",
                attrs: { src: imageUrl.trim() },
            })
            .run();
        setImageUrl("");
        setShowImageInput(false);
    };

    // 형광펜 (Highlight extension 기반)
    const toggleHighlight = (color = "#fff3a0") => {
        editor
            .chain()
            .focus()
            .toggleHighlight({ color })
            .run();
    };

    /* --------------------------------------------
     * Render
     * -------------------------------------------- */

    return (
        <div className="border-b border-border-light dark:border-border-dark bg-white dark:bg-surface-dark">
            <div className="flex flex-wrap items-center gap-1 px-4 py-2 overflow-x-auto">
                {/* Undo / Redo */}
                <ToolButton
                    icon={Undo}
                    onClick={() => editor.chain().focus().undo().run()}
                    disabled={!editor.can().undo()}
                    title="실행 취소 (Ctrl+Z)"
                />
                <ToolButton
                    icon={Redo}
                    onClick={() => editor.chain().focus().redo().run()}
                    disabled={!editor.can().redo()}
                    title="다시 실행 (Ctrl+Shift+Z)"
                />

                <Divider />

                {/* Text style */}
                <ToolButton
                    icon={Bold}
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    active={editor.isActive("bold")}
                    title="굵게 (Ctrl+B)"
                />
                <ToolButton
                    icon={Italic}
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    active={editor.isActive("italic")}
                    title="기울임 (Ctrl+I)"
                />
                <ToolButton
                    icon={UnderlineIcon}
                    onClick={() => editor.chain().focus().toggleUnderline().run()}
                    active={editor.isActive("underline")}
                    title="밑줄 (Ctrl+U)"
                />
                <ToolButton
                    icon={Strikethrough}
                    onClick={() => editor.chain().focus().toggleStrike().run()}
                    active={editor.isActive("strike")}
                    title="취소선"
                />
                <ToolButton
                    icon={Code}
                    onClick={() => editor.chain().focus().toggleCode().run()}
                    active={editor.isActive("code")}
                    title="코드 (Ctrl+E)"
                />

                <Divider />

                {/* Headings */}
                <ToolButton
                    icon={Heading1}
                    onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                    active={editor.isActive("heading", { level: 1 })}
                    title="제목 1"
                />
                <ToolButton
                    icon={Heading2}
                    onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                    active={editor.isActive("heading", { level: 2 })}
                    title="제목 2"
                />
                <ToolButton
                    icon={Heading3}
                    onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                    active={editor.isActive("heading", { level: 3 })}
                    title="제목 3"
                />

                <Divider />

                {/* Lists */}
                <ToolButton
                    icon={List}
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                    active={editor.isActive("bulletList")}
                    title="글머리 기호"
                />
                <ToolButton
                    icon={ListOrdered}
                    onClick={() => editor.chain().focus().toggleOrderedList().run()}
                    active={editor.isActive("orderedList")}
                    title="번호 매기기"
                />
                <ToolButton
                    icon={Quote}
                    onClick={() => editor.chain().focus().toggleBlockquote().run()}
                    active={editor.isActive("blockquote")}
                    title="인용"
                />

                <Divider />

                {/* Alignment */}
                <ToolButton
                    icon={AlignLeft}
                    onClick={() => editor.chain().focus().setTextAlign("left").run()}
                    active={editor.isActive({ textAlign: "left" })}
                    title="왼쪽 정렬"
                />
                <ToolButton
                    icon={AlignCenter}
                    onClick={() => editor.chain().focus().setTextAlign("center").run()}
                    active={editor.isActive({ textAlign: "center" })}
                    title="가운데 정렬"
                />
                <ToolButton
                    icon={AlignRight}
                    onClick={() => editor.chain().focus().setTextAlign("right").run()}
                    active={editor.isActive({ textAlign: "right" })}
                    title="오른쪽 정렬"
                />

                <Divider />

                {/* Highlight */}
                <ToolButton
                    icon={Highlighter}
                    onClick={() => toggleHighlight("#fff3a0")}
                    active={editor.isActive("highlight")}
                    title="형광펜 (Ctrl+Shift+H)"
                />

                {/* Link */}
                <ToolButton
                    icon={LinkIcon}
                    onClick={() => setShowLinkInput(!showLinkInput)}
                    active={editor.isActive("link")}
                    title="링크"
                />

                {/* Image */}
                <ToolButton
                    icon={ImageIcon}
                    onClick={() => setShowImageInput(!showImageInput)}
                    title="이미지"
                />

                {/* Divider */}
                <ToolButton
                    icon={Minus}
                    onClick={() => editor.chain().focus().setHorizontalRule().run()}
                    title="구분선"
                />
            </div>

            {/* Link input */}
            {showLinkInput && (
                <InputRow>
                    <input
                        value={linkUrl}
                        onChange={(e) => setLinkUrl(e.target.value)}
                        placeholder="https://example.com"
                        className="flex-1 px-3 py-2 rounded-lg border"
                    />
                    <button onClick={handleSetLink}>추가</button>
                    {editor.isActive("link") && (
                        <button onClick={handleRemoveLink}>제거</button>
                    )}
                    <button onClick={() => setShowLinkInput(false)}>
                        <X size={16} />
                    </button>
                </InputRow>
            )}

            {/* Image input */}
            {showImageInput && (
                <InputRow>
                    <input
                        value={imageUrl}
                        onChange={(e) => setImageUrl(e.target.value)}
                        placeholder="https://example.com/image.jpg"
                        className="flex-1 px-3 py-2 rounded-lg border"
                    />
                    <button onClick={handleAddImage}>추가</button>
                    <button onClick={() => setShowImageInput(false)}>
                        <X size={16} />
                    </button>
                </InputRow>
            )}
        </div>
    );
}

/* --------------------------------------------
 * Sub components
 * -------------------------------------------- */

function Divider() {
    return <div className="w-px h-6 bg-border-light dark:bg-border-dark mx-1" />;
}

function InputRow({ children }: { children: React.ReactNode }) {
    return (
        <div className="px-4 py-3 border-t border-border-light dark:border-border-dark flex gap-2">
            {children}
        </div>
    );
}

const ToolButton = ({
                        icon: Icon,
                        onClick,
                        active,
                        disabled,
                        title,
                    }: {
    icon: LucideIcon;
    onClick: () => void;
    active?: boolean;
    disabled?: boolean;
    title?: string;
}) => (
    <button
        type="button"
        onClick={onClick}
        disabled={disabled}
        title={title}
        className={`p-2 rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${
            active
                ? "bg-accent text-white"
                : "hover:bg-surface-light dark:hover:bg-surface-input text-text-primary-light dark:text-text-primary-dark"
        }`}
    >
        <Icon size={18} />
    </button>
);
