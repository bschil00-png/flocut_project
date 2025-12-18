"use client";

import { useMemo } from "react";

interface EditorFooterProps {
    content: string;
}

export default function EditorFooter({ content }: EditorFooterProps) {
    // HTML 태그 제거 후 통계 계산
    const stats = useMemo(() => {
        const plainText = content.replace(/<[^>]*>/g, "");
        const chars = plainText.length;
        const charsNoSpace = plainText.replace(/\s/g, "").length;
        const words = plainText.trim() ? plainText.trim().split(/\s+/).length : 0;
        const readTime = Math.ceil(words / 200); // 분당 200단어 기준

        return { chars, charsNoSpace, words, readTime };
    }, [content]);

    return (
        <div className="flex items-center justify-between px-8 py-3 border-t border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark text-sm text-text-muted-light dark:text-text-muted-dark">
            {/* 왼쪽: 문서 통계 */}
            <div className="flex items-center gap-4">
                <span>{stats.chars.toLocaleString()} 글자</span>
                <span>•</span>
                <span>{stats.words.toLocaleString()} 단어</span>
                <span>•</span>
                <span>{stats.charsNoSpace.toLocaleString()} 글자 (공백 제외)</span>
                <span>•</span>
                <span>약 {stats.readTime}분 읽기</span>
            </div>

            {/* 오른쪽: 저장 상태 */}
            <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span>자동 저장됨</span>
            </div>
        </div>
    );
}