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

type EditorToolbarProps = {
    editor: Editor | null;
};

/**
 * Titanic.css와 1:1 매핑
 * TextStyle 전용
 */
const TEXT_COLORS = [
    { label: "기본", class: "titanic-text-default" },
    { label: "빨강", class: "titanic-text-red" },
    { label: "파랑", class: "titanic-text-blue" },
    { label: "초록", class: "titanic-text-green" },
    { label: "보라", class: "titanic-text-purple" },
];

const FONT_SIZES = [
    { label: "S", class: "titanic-text-sm" },
    { label: "M", class: "titanic-text-md" },
    { label: "L", class: "titanic-text-lg" },
    { label: "XL", class: "titanic-text-xl" },
];

/**
 * Highlight extension 전용
 */
const HIGHLIGHT_COLORS = [
    { label: "노랑", color: "#fff3a0" },
    { label: "초록", color: "#d2f4c5" },
    { label: "파랑", color: "#dbeafe" },
    { label: "핑크", color: "#fce7f3" },
];

export default function EditorToolbar({ editor }: EditorToolbarProps) {
    const [linkUrl, setLinkUrl] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    const [showLinkInput, setShowLinkInput] = useState(false);
    const [showImageInput, setShowImageInput] = useState(false);

    if (!editor) return null;

    /**
     * 공통 버튼
     */
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

    /**
     * TextStyle 전용 (글자색 / 크기)
     */
    const applyTextStyle = (className: string) => {
        editor
            .chain()
            .focus()
            .setMark("textStyle", { class: className })
            .run();
    };

    /**
     * Highlight 전용
     */
    const toggleHighlight = (color: string) => {
        editor
            .chain()
            .focus()
            .toggleHighlight({ color })
            .run();
    };

    /**
     * 링크 / 이미지
     */
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

    return (
        <div className="border-b border-border-light dark:border-border-dark bg-white dark:bg-surface-dark">
            {/* 메인 툴바 */}
            <div className="flex flex-wrap items-center gap-1 px-4 py-2 overflow-x-auto">
                <ToolButton icon={Undo} onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()} />
                <ToolButton icon={Redo} onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()} />

                <div className="w-px h-6 bg-border-light dark:bg-border-dark mx-1" />

                <ToolButton icon={Bold} onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive("bold")} />
                <ToolButton icon={Italic} onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive("italic")} />
                <ToolButton icon={UnderlineIcon} onClick={() => editor.chain().focus().toggleUnderline().run()} active={editor.isActive("underline")} />
                <ToolButton icon={Strikethrough} onClick={() => editor.chain().focus().toggleStrike().run()} active={editor.isActive("strike")} />
                <ToolButton icon={Code} onClick={() => editor.chain().focus().toggleCode().run()} active={editor.isActive("code")} />

                <div className="w-px h-6 bg-border-light dark:bg-border-dark mx-1" />

                <ToolButton icon={Heading1} onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} active={editor.isActive("heading", { level: 1 })} />
                <ToolButton icon={Heading2} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} active={editor.isActive("heading", { level: 2 })} />
                <ToolButton icon={Heading3} onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} active={editor.isActive("heading", { level: 3 })} />

                <div className="w-px h-6 bg-border-light dark:bg-border-dark mx-1" />

                <ToolButton icon={List} onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive("bulletList")} />
                <ToolButton icon={ListOrdered} onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive("orderedList")} />
                <ToolButton icon={Quote} onClick={() => editor.chain().focus().toggleBlockquote().run()} active={editor.isActive("blockquote")} />

                <div className="w-px h-6 bg-border-light dark:bg-border-dark mx-1" />

                <ToolButton icon={AlignLeft} onClick={() => editor.chain().focus().setTextAlign("left").run()} />
                <ToolButton icon={AlignCenter} onClick={() => editor.chain().focus().setTextAlign("center").run()} />
                <ToolButton icon={AlignRight} onClick={() => editor.chain().focus().setTextAlign("right").run()} />

                <div className="w-px h-6 bg-border-light dark:bg-border-dark mx-1" />

                <ToolButton
                    icon={Highlighter}
                    onClick={() => toggleHighlight("#fff3a0")}
                    active={editor.isActive("highlight")}
                    title="형광펜 (Ctrl+Shift+H)"
                />

                <ToolButton icon={LinkIcon} onClick={() => setShowLinkInput(!showLinkInput)} active={editor.isActive("link")} />
                <ToolButton icon={ImageIcon} onClick={() => setShowImageInput(!showImageInput)} />
                <ToolButton icon={Minus} onClick={() => editor.chain().focus().setHorizontalRule().run()} />
            </div>

            {/* 프리셋 영역 */}
            <div className="flex flex-wrap items-center gap-4 px-4 py-2 border-t border-border-light dark:border-border-dark">
                <div className="flex gap-1">
                    {TEXT_COLORS.map(c => (
                        <button key={c.class} onClick={() => applyTextStyle(c.class)} className="px-2 py-1 text-xs rounded hover:bg-surface-light dark:hover:bg-surface-input">
                            {c.label}
                        </button>
                    ))}
                </div>

                <div className="flex gap-1">
                    {FONT_SIZES.map(s => (
                        <button key={s.class} onClick={() => applyTextStyle(s.class)} className="px-2 py-1 text-xs rounded hover:bg-surface-light dark:hover:bg-surface-input">
                            {s.label}
                        </button>
                    ))}
                </div>

                <div className="flex gap-1">
                    {HIGHLIGHT_COLORS.map(h => (
                        <button
                            key={h.color}
                            onClick={() => toggleHighlight(h.color)}
                            className="w-5 h-5 rounded"
                            style={{ backgroundColor: h.color }}
                            title={h.label}
                        />
                    ))}
                </div>
            </div>

            {/* 링크 입력 */}
            {showLinkInput && (
                <div className="px-4 py-3 border-t border-border-light dark:border-border-dark">
                    <div className="flex gap-2">
                        <input value={linkUrl} onChange={e => setLinkUrl(e.target.value)} className="flex-1 px-3 py-2 rounded-lg border" />
                        <button onClick={handleSetLink}>추가</button>
                        {editor.isActive("link") && <button onClick={handleRemoveLink}>제거</button>}
                        <button onClick={() => setShowLinkInput(false)}><X size={16} /></button>
                    </div>
                </div>
            )}

            {/* 이미지 입력 */}
            {showImageInput && (
                <div className="px-4 py-3 border-t border-border-light dark:border-border-dark">
                    <div className="flex gap-2">
                        <input value={imageUrl} onChange={e => setImageUrl(e.target.value)} className="flex-1 px-3 py-2 rounded-lg border" />
                        <button onClick={handleAddImage}>추가</button>
                        <button onClick={() => setShowImageInput(false)}><X size={16} /></button>
                    </div>
                </div>
            )}
        </div>
    );
}
