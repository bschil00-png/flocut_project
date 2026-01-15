"use client";

import { useEditor, EditorContent, Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Placeholder from "@tiptap/extension-placeholder";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import Highlight from "@tiptap/extension-highlight";
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
    const isMobile = useMediaQuery("(max-width: 768px)");

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const editor = useEditor({
        immediatelyRender: false,

        extensions: [
            StarterKit.configure({
                heading: { levels: [1, 2, 3] },
                bulletList: { keepMarks: true },
                orderedList: { keepMarks: true },
            }),

            // 글자 색 / 크기용 (형광펜 아님)
            TextStyle,

            Underline,

            TextAlign.configure({
                types: ["heading", "paragraph"],
            }),

            //  형광펜
            Highlight.extend({
                addKeyboardShortcuts() {
                    return {
                        "Mod-Shift-h": () =>
                            this.editor
                                .chain()
                                .focus()
                                .toggleHighlight({ color: "#fff3a0" })
                                .run(),
                    };
                },
            }).configure({
                multicolor: true,
            }),

            Link.configure({
                openOnClick: false,
                HTMLAttributes: {
                    class: "tiptap-link",
                },
            }),

            Image.configure({
                inline: true,
                allowBase64: true,
                HTMLAttributes: {
                    class: "tiptap-image",
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
                class: "ProseMirror titanic-editor focus:outline-none min-h-[200px]",
            },
        },
    });

    // 외부 content → editor 반영 (커서 유지)
    useEffect(() => {
        if (!editor) return;
        if (content === editor.getHTML()) return;

        const { from, to } = editor.state.selection;

        editor.commands.setContent(content, { emitUpdate: false });

        const maxPos = editor.state.doc.content.size;
        editor.commands.setTextSelection({
            from: Math.min(from, maxPos),
            to: Math.min(to, maxPos),
        });
    }, [content, editor]);

    // editor ready callback
    useEffect(() => {
        if (editor && onReady) {
            onReady(editor);
        }
    }, [editor, onReady]);

    if (!isMounted || !editor) {
        return (
            <div className="flex items-center justify-center min-h-[200px] text-sm text-text-muted-light">
                에디터 로딩 중…
            </div>
        );
    }

    return (
        <div className="tiptap-wrapper">
            {editable && <BubbleMenuToolbar editor={editor} />}

            <EditorContent editor={editor} />

            {editable && showMobileToolbar && isMobile && (
                <MobileBottomToolbar editor={editor} />
            )}
        </div>
    );
}
