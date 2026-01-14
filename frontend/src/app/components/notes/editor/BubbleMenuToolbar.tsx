"use client";

import { Editor } from "@tiptap/react";
import { BubbleMenu } from "@tiptap/react/menus";

import {
    Bold,
    Italic,
    Underline as UnderlineIcon,
    Strikethrough,
    Code,
    Link as LinkIcon,
    Highlighter,
    MoreHorizontal,
    Type,
    AlignLeft,
    AlignCenter,
    AlignRight,
} from "lucide-react";
import { useState } from "react";

// Types

interface BubbleMenuToolbarProps {
    editor: Editor;
}

// Main Component

export default function BubbleMenuToolbar({ editor }: BubbleMenuToolbarProps) {
    // --------------------------------------------
    // State
    // --------------------------------------------

    const [showMore, setShowMore] = useState(false);
    const [linkUrl, setLinkUrl] = useState("");
    const [showLinkInput, setShowLinkInput] = useState(false);

    if (!editor) return null;

    // --------------------------------------------
    // Handlers
    // --------------------------------------------

    const handleSetLink = () => {
        if (linkUrl.trim()) {
            editor.chain().focus().setLink({ href: linkUrl.trim() }).run();
            setLinkUrl("");
            setShowLinkInput(false);
        }
    };

    const handleRemoveLink = () => {
        editor.chain().focus().unsetLink().run();
        setShowLinkInput(false);
    };

    // --------------------------------------------
    // Render
    // --------------------------------------------

    return (
        <BubbleMenu
            editor={editor}
            options={{
                placement: "top",
                offset: {
                    mainAxis: 8,
                },
            }}
            shouldShow={({ state }) => {
                const { from, to } = state.selection;
                return from !== to;
            }}
            className="bubble-menu-container"
        >

        <div className="flex items-center gap-0.5 p-1 rounded-lg border border-border-light dark:border-border-dark bg-white dark:bg-surface-dark shadow-lg">

                {/* 기본 포맷팅 */}
                <ToolButton
                    icon={<Bold size={16} />}
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    active={editor.isActive("bold")}
                    title="굵게 (⌘B)"
                />
                <ToolButton
                    icon={<Italic size={16} />}
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    active={editor.isActive("italic")}
                    title="기울임 (⌘I)"
                />
                <ToolButton
                    icon={<UnderlineIcon size={16} />}
                    onClick={() => editor.chain().focus().toggleUnderline().run()}
                    active={editor.isActive("underline")}
                    title="밑줄 (⌘U)"
                />
                <ToolButton
                    icon={<Strikethrough size={16} />}
                    onClick={() => editor.chain().focus().toggleStrike().run()}
                    active={editor.isActive("strike")}
                    title="취소선"
                />
                <ToolButton
                    icon={<Code size={16} />}
                    onClick={() => editor.chain().focus().toggleCode().run()}
                    active={editor.isActive("code")}
                    title="코드"
                />

                <div className="w-px h-5 bg-border-light dark:bg-border-dark mx-1" />

                {/* 링크 */}
                <ToolButton
                    icon={<LinkIcon size={16} />}
                    onClick={() => setShowLinkInput(!showLinkInput)}
                    active={editor.isActive("link")}
                    title="링크"
                />

                {/* 하이라이트 */}
                <ToolButton
                    icon={<Highlighter size={16} />}
                    onClick={() => editor.chain().focus().toggleHighlight().run()}
                    active={editor.isActive("highlight")}
                    title="하이라이트"
                />

                <div className="w-px h-5 bg-border-light dark:bg-border-dark mx-1" />

                {/* 더보기 */}
                <ToolButton
                    icon={<MoreHorizontal size={16} />}
                    onClick={() => setShowMore(!showMore)}
                    active={showMore}
                    title="더보기"
                />

                {/* 더보기 메뉴 */}
                {showMore && (
                    <>
                        <div className="w-px h-5 bg-border-light dark:bg-border-dark mx-1" />

                        <ToolButton
                            icon={<Type size={16} />}
                            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                            active={editor.isActive("heading", { level: 2 })}
                            title="제목 2"
                        />
                        <ToolButton
                            icon={<AlignLeft size={16} />}
                            onClick={() => editor.chain().focus().setTextAlign("left").run()}
                            active={editor.isActive({ textAlign: "left" })}
                            title="왼쪽 정렬"
                        />
                        <ToolButton
                            icon={<AlignCenter size={16} />}
                            onClick={() => editor.chain().focus().setTextAlign("center").run()}
                            active={editor.isActive({ textAlign: "center" })}
                            title="가운데 정렬"
                        />
                        <ToolButton
                            icon={<AlignRight size={16} />}
                            onClick={() => editor.chain().focus().setTextAlign("right").run()}
                            active={editor.isActive({ textAlign: "right" })}
                            title="오른쪽 정렬"
                        />
                    </>
                )}
            </div>

            {/* 링크 입력창 */}
            {showLinkInput && (
                <div className="mt-2 p-2 rounded-lg border border-border-light dark:border-border-dark bg-white dark:bg-surface-dark shadow-lg">
                    <div className="flex items-center gap-2">
                        <input
                            type="url"
                            value={linkUrl}
                            onChange={(e) => setLinkUrl(e.target.value)}
                            placeholder="https://example.com"
                            autoFocus
                            className="flex-1 px-2 py-1 text-sm rounded border border-border-light dark:border-border-dark bg-transparent outline-none focus:ring-2 focus:ring-accent"
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    e.preventDefault();
                                    handleSetLink();
                                }
                                if (e.key === "Escape") {
                                    e.preventDefault();
                                    setShowLinkInput(false);
                                }
                            }}
                        />
                        <button
                            onClick={handleSetLink}
                            disabled={!linkUrl.trim()}
                            className="px-2 py-1 text-sm rounded bg-accent text-white hover:bg-accent-dark disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            추가
                        </button>
                        {editor.isActive("link") && (
                            <button
                                onClick={handleRemoveLink}
                                className="px-2 py-1 text-sm rounded bg-red-500 text-white hover:bg-red-600"
                            >
                                제거
                            </button>
                        )}
                    </div>
                </div>
            )}
        </BubbleMenu>
    );
}

// Sub Components

function ToolButton({
                        icon,
                        onClick,
                        active = false,
                        disabled = false,
                        title,
                    }: {
    icon: React.ReactNode;
    onClick: () => void;
    active?: boolean;
    disabled?: boolean;
    title?: string;
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            disabled={disabled}
            title={title}
            className={`
        p-1.5 rounded transition-colors
        ${active
                ? "bg-accent text-white"
                : "text-text-primary-light dark:text-text-primary-dark hover:bg-surface-light dark:hover:bg-surface-input"
            }
        disabled:opacity-40 disabled:cursor-not-allowed
      `}
        >
            {icon}
        </button>
    );
}