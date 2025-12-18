"use client";

import { useEffect, useState } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { TextStyle } from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";
import Highlight from "@tiptap/extension-highlight";
import TextAlign from "@tiptap/extension-text-align";
import Underline from "@tiptap/extension-underline";
import Placeholder from "@tiptap/extension-placeholder";

interface TiptapEditorProps {
    content: string;
    editable: boolean;
    onContentChange?: (value: string) => void;
    placeholder?: string;
}

export default function TiptapEditor({
                                         content,
                                         editable,
                                         onContentChange,
                                         placeholder = "내용을 입력하세요..."
                                     }: TiptapEditorProps) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const editor = useEditor({
        editable,
        content,
        immediatelyRender: false,
        extensions: [
            StarterKit.configure({
                heading: {
                    levels: [1, 2, 3, 4, 5, 6],
                },
            }),
            TextStyle,
            Color,
            Highlight.configure({
                multicolor: true,
            }),
            TextAlign.configure({
                types: ["heading", "paragraph"],
            }),
            Underline,
            Placeholder.configure({
                placeholder,
            }),
        ],
        onUpdate({ editor }) {
            if (onContentChange) {
                onContentChange(editor.getHTML());
            }
        },
        editorProps: {
            attributes: {
                class: "prose prose-lg dark:prose-invert max-w-none focus:outline-none min-h-[500px] px-8 py-4",
            },
        },
    });

    // content가 변경되면 에디터 업데이트
    useEffect(() => {
        if (editor && content !== editor.getHTML()) {
            editor.commands.setContent(content);
        }
    }, [content, editor]);

    // editable 상태 변경 시 에디터 업데이트
    useEffect(() => {
        if (editor) {
            editor.setEditable(editable);
        }
    }, [editable, editor]);

    if (!mounted) {
        return (
            <div className="flex items-center justify-center min-h-[500px]">
                <div className="text-text-muted-light dark:text-text-muted-dark">
                    에디터 로딩 중...
                </div>
            </div>
        );
    }

    return (
        <div className="w-full">
            <EditorContent
                editor={editor}
                className="tiptap-editor bg-background-light dark:bg-background-dark text-text-primary-light dark:text-text-primary-dark"
            />
        </div>
    );
}