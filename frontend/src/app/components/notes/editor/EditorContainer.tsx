"use client";

import { useEffect, useState } from "react";
import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { TextStyle } from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";
import Highlight from "@tiptap/extension-highlight";
import TextAlign from "@tiptap/extension-text-align";
import Underline from "@tiptap/extension-underline";
import Placeholder from "@tiptap/extension-placeholder";

import EditorToolbar from "./EditorToolbar";
import EditorFormattingToolbar from "./EditorFormattingToolbar";
import EditorFooter from "./EditorFooter";
import TiptapEditor from "./TiptapEditor";
import { Loader2 } from "lucide-react";

interface EditorContainerProps {
    noteId: string;
    onAIAction: (mode: "summary" | "feedback" | "compare") => void;
    onToggleRightPanel: () => void;
    rightPanelOpen: boolean;
}

export default function EditorContainer({
                                            noteId,
                                            onAIAction,
                                            onToggleRightPanel,
                                            rightPanelOpen,
                                        }: EditorContainerProps) {
    const [isEditing, setEditing] = useState(true);
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [isLoading, setIsLoading] = useState(true);

    // Tiptap 에디터 초기화
    const editor = useEditor({
        editable: isEditing,
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
                placeholder: "내용을 입력하세요...",
            }),
        ],
        onUpdate({ editor }) {
            setContent(editor.getHTML());
        },
        editorProps: {
            attributes: {
                class: "prose prose-lg dark:prose-invert max-w-none focus:outline-none min-h-[500px] px-8 py-4",
            },
        },
    });

    // 노트 데이터 로드
    useEffect(() => {
        setIsLoading(true);
        const mock: Record<string, { title: string; content: string }> = {
            "1": {
                title: "3월 마케팅 회의",
                content: "<h2>회의록</h2><p>2024년 3월 마케팅 전략 회의 내용입니다.</p>",
            },
            "2": {
                title: "FloCut 기획 정리",
                content: "<h2>MVP 정의</h2><p>핵심 기능을 정의합니다.</p>",
            },
            "3": {
                title: "개발 일정 정리",
                content: "<h2>스프린트 구성</h2><p>2주 단위 스프린트로 진행합니다.</p>",
            },
        };

        const data = mock[noteId] ?? { title: "새 노트", content: "<p></p>" };
        setTitle(data.title);
        setContent(data.content);

        // 에디터 초기화
        if (editor) {
            editor.commands.setContent(data.content);
        }

        setTimeout(() => setIsLoading(false), 300);
    }, [noteId, editor]);

    // 편집 모드 토글
    useEffect(() => {
        if (editor) {
            editor.setEditable(isEditing);
        }
    }, [isEditing, editor]);

    if (isLoading) {
        return (
            <div className="flex-1 flex items-center justify-center bg-background-light dark:bg-background-dark">
                <Loader2 className="animate-spin text-accent" size={32} />
            </div>
        );
    }

    return (
        <div className="flex-1 flex flex-col bg-background-light dark:bg-background-dark overflow-hidden">
            {/* 상단 툴바 */}
            <EditorToolbar
                isEditing={isEditing}
                onToggleEdit={() => setEditing(!isEditing)}
                editorContent={content}
                onAIAction={onAIAction}
                onToggleRightPanel={onToggleRightPanel}
                rightPanelOpen={rightPanelOpen}
            />

            {/* 포맷팅 툴바 (편집 모드에만 표시) */}
            {isEditing && <EditorFormattingToolbar editor={editor} />}

            {/* 에디터 본문 */}
            <div className="flex-1 overflow-y-auto">
                <div className="max-w-4xl mx-auto py-8">
                    {/* 제목 */}
                    <div className="px-8 mb-4">
                        {isEditing ? (
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="제목 없음"
                                className="w-full text-5xl font-bold bg-transparent border-none outline-none text-text-primary-light dark:text-text-primary-dark placeholder-text-muted-light dark:placeholder-text-muted-dark"
                            />
                        ) : (
                            <h1 className="text-5xl font-bold text-text-primary-light dark:text-text-primary-dark">
                                {title || "제목 없음"}
                            </h1>
                        )}

                        {/* 메타 정보 */}
                        <div className="flex items-center gap-2 mt-2 text-sm text-text-muted-light dark:text-text-muted-dark">
                            <span>2024년 12월 18일</span>
                            <span>•</span>
                            <span>마지막 수정: 방금 전</span>
                        </div>
                    </div>

                    {/* Tiptap 에디터 */}
                    <TiptapEditor
                        content={content}
                        editable={isEditing}
                        onContentChange={setContent}
                    />
                </div>
            </div>

            {/* 하단 푸터 */}
            <EditorFooter content={content} />
        </div>
    );
}