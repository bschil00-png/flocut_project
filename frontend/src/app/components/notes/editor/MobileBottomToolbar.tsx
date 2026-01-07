"use client";

import { Editor } from "@tiptap/react";
import {
    Bold,
    Italic,
    Underline as UnderlineIcon,
    Link as LinkIcon,
    List,
    ListOrdered,
    Heading2,
    MoreHorizontal,
    X,
} from "lucide-react";
import { useState } from "react";

// ============================================
// Types
// ============================================

interface MobileBottomToolbarProps {
    editor: Editor | null;
}

// ============================================
// Main Component
// ============================================

export default function MobileBottomToolbar({ editor }: MobileBottomToolbarProps) {
    // --------------------------------------------
    // State
    // --------------------------------------------

    const [showMore, setShowMore] = useState(false);

    if (!editor) return null;

    // --------------------------------------------
    // Render
    // --------------------------------------------

    return (
        <>
            {/* 하단 고정 툴바 (모바일만) */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-surface-dark border-t border-border-light dark:border-border-dark z-50 safe-area-pb">
                <div className="flex items-center gap-1 p-2 overflow-x-auto">
                    <MobileToolButton
                        icon={<Bold size={18} />}
                        onClick={() => editor.chain().focus().toggleBold().run()}
                        active={editor.isActive("bold")}
                        label="굵게"
                    />
                    <MobileToolButton
                        icon={<Italic size={18} />}
                        onClick={() => editor.chain().focus().toggleItalic().run()}
                        active={editor.isActive("italic")}
                        label="기울임"
                    />
                    <MobileToolButton
                        icon={<UnderlineIcon size={18} />}
                        onClick={() => editor.chain().focus().toggleUnderline().run()}
                        active={editor.isActive("underline")}
                        label="밑줄"
                    />

                    <div className="w-px h-10 bg-border-light dark:bg-border-dark mx-1" />

                    <MobileToolButton
                        icon={<Heading2 size={18} />}
                        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                        active={editor.isActive("heading", { level: 2 })}
                        label="제목"
                    />
                    <MobileToolButton
                        icon={<List size={18} />}
                        onClick={() => editor.chain().focus().toggleBulletList().run()}
                        active={editor.isActive("bulletList")}
                        label="목록"
                    />
                    <MobileToolButton
                        icon={<ListOrdered size={18} />}
                        onClick={() => editor.chain().focus().toggleOrderedList().run()}
                        active={editor.isActive("orderedList")}
                        label="번호"
                    />

                    <div className="w-px h-10 bg-border-light dark:bg-border-dark mx-1" />

                    <MobileToolButton
                        icon={<LinkIcon size={18} />}
                        onClick={() => {
                            const url = window.prompt("링크 URL:");
                            if (url) {
                                editor.chain().focus().setLink({ href: url }).run();
                            }
                        }}
                        active={editor.isActive("link")}
                        label="링크"
                    />

                    <MobileToolButton
                        icon={<MoreHorizontal size={18} />}
                        onClick={() => setShowMore(!showMore)}
                        active={showMore}
                        label="더보기"
                    />
                </div>
            </div>

            {/* 더보기 오버레이 */}
            {showMore && (
                <div className="md:hidden fixed inset-0 bg-black/50 z-40" onClick={() => setShowMore(false)}>
                    <div
                        className="absolute bottom-14 left-0 right-0 bg-white dark:bg-surface-dark border-t border-border-light dark:border-border-dark p-4"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-semibold text-text-primary-light dark:text-text-primary-dark">
                                추가 서식
                            </h3>
                            <button
                                onClick={() => setShowMore(false)}
                                className="p-2 rounded-lg hover:bg-surface-light dark:hover:bg-surface-input"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="grid grid-cols-3 gap-2">
                            <MobileMoreButton
                                label="제목 1"
                                onClick={() => {
                                    editor.chain().focus().toggleHeading({ level: 1 }).run();
                                    setShowMore(false);
                                }}
                                active={editor.isActive("heading", { level: 1 })}
                            />
                            <MobileMoreButton
                                label="제목 2"
                                onClick={() => {
                                    editor.chain().focus().toggleHeading({ level: 2 }).run();
                                    setShowMore(false);
                                }}
                                active={editor.isActive("heading", { level: 2 })}
                            />
                            <MobileMoreButton
                                label="제목 3"
                                onClick={() => {
                                    editor.chain().focus().toggleHeading({ level: 3 }).run();
                                    setShowMore(false);
                                }}
                                active={editor.isActive("heading", { level: 3 })}
                            />
                            <MobileMoreButton
                                label="인용"
                                onClick={() => {
                                    editor.chain().focus().toggleBlockquote().run();
                                    setShowMore(false);
                                }}
                                active={editor.isActive("blockquote")}
                            />
                            <MobileMoreButton
                                label="코드"
                                onClick={() => {
                                    editor.chain().focus().toggleCodeBlock().run();
                                    setShowMore(false);
                                }}
                                active={editor.isActive("codeBlock")}
                            />
                            <MobileMoreButton
                                label="구분선"
                                onClick={() => {
                                    editor.chain().focus().setHorizontalRule().run();
                                    setShowMore(false);
                                }}
                            />
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

// ============================================
// Sub Components
// ============================================

function MobileToolButton({
                              icon,
                              onClick,
                              active = false,
                              label,
                          }: {
    icon: React.ReactNode;
    onClick: () => void;
    active?: boolean;
    label: string;
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={`
        flex flex-col items-center justify-center gap-1 p-2 rounded-lg min-w-[44px] min-h-[44px]
        transition-colors
        ${active
                ? "bg-accent text-white"
                : "text-text-primary-light dark:text-text-primary-dark hover:bg-surface-light dark:hover:bg-surface-input"
            }
      `}
        >
            {icon}
            <span className="text-[10px] font-medium">{label}</span>
        </button>
    );
}

function MobileMoreButton({
                              label,
                              onClick,
                              active = false,
                          }: {
    label: string;
    onClick: () => void;
    active?: boolean;
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={`
        p-3 rounded-lg text-sm font-medium transition-colors
        ${active
                ? "bg-accent text-white"
                : "bg-surface-light dark:bg-surface-input text-text-primary-light dark:text-text-primary-dark hover:bg-accent-soft"
            }
      `}
        >
            {label}
        </button>
    );
}