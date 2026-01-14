"use client";

import { useEditor, EditorContent, Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Highlight from "@tiptap/extension-highlight";
import Placeholder from "@tiptap/extension-placeholder";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import Color from "@tiptap/extension-color";
import { TextStyle } from "@tiptap/extension-text-style";

import { useEffect, useState } from "react";
import { useMediaQuery } from "@/hooks/common/useMediaQuery";

import BubbleMenuToolbar from "./BubbleMenuToolbar";
import MobileBottomToolbar from "./MobileBottomToolbar";

type TiptapEditorProps = {
    content: string;
    onChange: (content: string) => void;
    placeholder?: string;
    editable?: boolean;
    onReady?: (editor: Editor) => void;
    showMobileToolbar?: boolean;
};

export default function TiptapEditor({
                                         content,
                                         onChange,
                                         placeholder = "내용을 입력하세요...",
                                         editable = true,
                                         onReady,
                                         showMobileToolbar = true,
                                     }: TiptapEditorProps) {
    const [isMounted, setIsMounted] = useState(false);

    // 반응형 감지
    const isMobile = useMediaQuery("(max-width: 768px)");

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const editor = useEditor({
        immediatelyRender: false,
        extensions: [
            StarterKit.configure({
                heading: {
                    levels: [1, 2, 3],
                },
                bulletList: {
                    keepMarks: true,
                    keepAttributes: false,
                },
                orderedList: {
                    keepMarks: true,
                    keepAttributes: false,
                },
            }),
            TextStyle,
            Color,
            Underline,
            TextAlign.configure({
                types: ["heading", "paragraph"],
            }),
            Highlight.configure({
                multicolor: false,
            }),
            Link.configure({
                openOnClick: false,
                HTMLAttributes: {
                    class: "text-accent underline cursor-pointer hover:bg-accent-dark",
                },
            }),
            Image.configure({
                inline: true,
                allowBase64: true,
                HTMLAttributes: {
                    class: "max-w-full h-auto rounded-lg my-4",
                },
            }),
            Placeholder.configure({
                placeholder,
            }),
        ],
        content,
        editable,
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
        editorProps: {
            attributes: {
                class:
                    "prose prose-lg max-w-none focus:outline-none min-h-[200px] text-text-primary-light dark:text-text-primary-dark",
            },
        },
    });

    useEffect(() => {
        if (!editor) return;

        if (content !== editor.getHTML()) {
            const { from, to } = editor.state.selection;

            editor.commands.setContent(content, {
                emitUpdate: false,
            });

            const maxPos = editor.state.doc.content.size;
            editor.commands.setTextSelection({
                from: Math.min(from, maxPos),
                to: Math.min(to, maxPos),
            });
        }
    }, [content, editor]);

    useEffect(() => {
        if (editor && onReady) {
            onReady(editor);
        }
    }, [editor, onReady]);

    useEffect(() => {
        return () => {
            editor?.destroy();
        };
    }, [editor]);

    if (!isMounted || !editor) {
        return (
            <div className="flex items-center justify-center min-h-[200px] text-text-muted-light dark:text-text-muted-dark">
                <div className="text-sm">에디터 로딩 중...</div>
            </div>
        );
    }

    return (
        <div className="tiptap-wrapper">
            {editable && <BubbleMenuToolbar editor={editor} />}
            <EditorContent editor={editor} />

            {/*  모바일에서만 하단 툴바 표시 */}
            {editable && showMobileToolbar && isMobile && (
                <MobileBottomToolbar editor={editor} />
            )}
        </div>
    );
}