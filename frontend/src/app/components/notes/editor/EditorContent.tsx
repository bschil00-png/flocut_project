// components/editor/EditorContent.tsx
"use client";

interface EditorContentProps {
    title: string;
    content: string;
    onTitleChange: (title: string) => void;
    onContentChange: (content: string) => void;
}

export default function EditorContent({
                                          title,
                                          content,
                                          onTitleChange,
                                          onContentChange,
                                      }: EditorContentProps) {
    return (
        <div className="flex-1 overflow-y-auto">
            <div className="max-w-4xl mx-auto px-16 py-16">
                {/* 제목 입력 */}
                <input
                    type="text"
                    value={title}
                    onChange={(e) => onTitleChange(e.target.value)}
                    placeholder="제목 없음"
                    className="w-full text-5xl font-bold bg-transparent border-none outline-none mb-6 text-text-primary-light dark:text-text-primary-dark placeholder:text-text-muted-light/50 dark:placeholder:text-text-muted-dark/50"
                />

                {/* 메타 정보 */}
                <div className="flex items-center gap-3 text-sm text-text-muted-light dark:text-text-muted-dark mb-12">
                    <span>2024년 12월 16일</span>
                    <span>•</span>
                    <span>마지막 수정: 방금 전</span>
                </div>

                {/* 본문 입력 */}
                <textarea
                    value={content}
                    onChange={(e) => onContentChange(e.target.value)}
                    placeholder="여기에 작성하세요..."
                    className="w-full min-h-[600px] text-lg leading-loose bg-transparent border-none outline-none resize-none text-text-primary-light dark:text-text-primary-dark placeholder:text-text-muted-light/50 dark:placeholder:text-text-muted-dark/50"
                />
            </div>
        </div>
    );
}