// components/editor/EditorContainer.tsx
"use client";

import { useState, useEffect } from "react";
import EditorToolbar from "./EditorToolbar";
import EditorContent from "./EditorContent";
import EditorFooter from "./EditorFooter";

interface EditorContainerProps {
    noteId: string;
    onOpenContextPanel: (
        mode:
            | "properties"
            | "ai-summary"
            | "ai-feedback"
            | "ai-compare"
            | "versions"
            | "comments"
    ) => void;
    contextPanelOpen: boolean;
}

export default function EditorContainer({
                                            noteId,
                                            onOpenContextPanel,
                                            contextPanelOpen,
                                        }: EditorContainerProps) {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [isLoading, setIsLoading] = useState(true);

    // noteId가 변경될 때마다 노트 데이터 로드
    useEffect(() => {
        setIsLoading(true);

        // 실제로는 API에서 데이터를 가져옴
        const mockNotes: Record<string, { title: string; content: string }> = {
            "1": {
                title: "3월 마케팅 회의",
                content: `# 3월 마케팅 회의

## 참석자
- 김팀장 (마케팅)
- 이과장 (영업)
- 박대리 (기획)

## 주요 안건
1. Q1 성과 리뷰
2. Q2 목표 설정
3. 신규 캠페인 기획

## 논의 내용
Q1 매출 목표를 115% 달성했으며, 소셜 미디어 참여율이 30% 증가했습니다.
신규 고객 확보는 2,500명으로 목표치를 초과 달성했습니다.

## 액션 아이템
- [ ] Q2 캠페인 예산안 작성 (김팀장)
- [ ] 경쟁사 분석 보고서 준비 (이과장)
- [ ] 타겟 고객 페르소나 재정의 (박대리)`,
            },
            "2": {
                title: "FloCut 기획 정리",
                content: `# FloCut 프로젝트 기획

## 프로젝트 개요
FloCut은 문서와 음성 데이터를 자동으로 요약하고, 여러 자료 간 흐름을 비교하며, 
AI가 사용자의 이해를 돕는 피드백을 제공하는 지능형 문서 보조 플랫폼입니다.

## 핵심 기능
1. 문서 요약
2. 음성 요약
3. 다중 문서 비교
4. AI 피드백

## 차별화 포인트
- 개인 지식 기반으로 성장하는 Personal Knowledge AI
- 요약 → 비교 → 피드백까지 이어지는 통합 문서 사이클
- 문서 품질까지 분석하는 AI 코치 기능`,
            },
            "3": {
                title: "개발 일정 정리",
                content: `# 개발 일정

## Sprint 1 (2주)
- 사용자 인증 시스템
- 기본 노트 CRUD
- 파일 업로드 기능

## Sprint 2 (2주)
- AI 요약 기능
- 문서 비교 기능
- 벡터 DB 연동`,
            },
        };

        const noteData = mockNotes[noteId] || { title: "새 노트", content: "" };
        setTitle(noteData.title);
        setContent(noteData.content);
        setIsLoading(false);
    }, [noteId]);

    if (isLoading) {
        return (
            <div className="flex-1 flex items-center justify-center bg-background-light dark:bg-background-dark">
                <div className="text-center">
                    <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
                    <p className="text-sm text-text-muted-light dark:text-text-muted-dark">
                        로딩 중...
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex-1 flex flex-col bg-background-light dark:bg-background-dark">
            <EditorToolbar
                onOpenContextPanel={onOpenContextPanel}
                contextPanelOpen={contextPanelOpen}
            />

            <EditorContent
                title={title}
                content={content}
                onTitleChange={setTitle}
                onContentChange={setContent}
            />

            <EditorFooter content={content} />
        </div>
    );
}