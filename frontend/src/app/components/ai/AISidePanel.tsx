// components/ai/AISidePanel.tsx
"use client";

import { useState } from "react";
import { X, Sparkles, Copy, Check, RefreshCw } from "lucide-react";
import IconButton from "@/app/components/ui/icon-button/IconButton";
import Button from "@/app/components/ui/button/Button";

interface AISidePanelProps {
    mode: "summary" | "feedback" | "compare";
    onClose: () => void;
}

export default function AISidePanel({ mode, onClose }: AISidePanelProps) {
    const [loading, setLoading] = useState(false);
    const [copied, setCopied] = useState(false);

    const titles = {
        summary: "AI 요약",
        feedback: "AI 피드백",
        compare: "버전 비교",
    };

    const handleCopy = () => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleRegenerate = () => {
        setLoading(true);
        setTimeout(() => setLoading(false), 2000);
    };

    return (
        <aside className="w-96 h-full border-l border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark flex flex-col">
            {/* 헤더 */}
            <div className="h-14 px-4 flex items-center justify-between border-b border-border-light dark:border-border-dark">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent to-accent-hover flex items-center justify-center">
                        <Sparkles size={16} className="text-white" />
                    </div>
                    <h2 className="text-sm font-semibold text-text-primary-light dark:text-text-primary-dark">
                        {titles[mode]}
                    </h2>
                </div>
                <IconButton icon={<X size={16} />} onClick={onClose} />
            </div>

            {/* AI 결과 영역 */}
            <div className="flex-1 overflow-y-auto p-4">
                {loading ? (
                    <div className="flex flex-col items-center justify-center h-full gap-4">
                        <div className="w-12 h-12 rounded-full border-4 border-accent/30 border-t-accent animate-spin" />
                        <p className="text-sm text-text-muted-light dark:text-text-muted-dark">
                            AI가 분석 중입니다...
                        </p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {/* AI 결과 카드 */}
                        <div className="p-4 rounded-lg bg-background-light dark:bg-background-dark border border-border-light dark:border-border-dark">
                            <div className="prose prose-sm dark:prose-invert max-w-none">
                                {mode === "summary" && (
                                    <>
                                        <h3 className="text-sm font-semibold mb-2">핵심 요약</h3>
                                        <p className="text-sm leading-relaxed text-text-primary-light dark:text-text-primary-dark">
                                            이 문서는 3월 마케팅 전략에 대한 회의 내용을 담고 있습니다.
                                            주요 논의사항으로는 Q1 성과 분석, Q2 목표 설정, 신규 캠페인 기획이 포함되어 있습니다.
                                        </p>
                                        <h4 className="text-sm font-semibold mt-4 mb-2">주요 포인트</h4>
                                        <ul className="text-sm space-y-1">
                                            <li>Q1 매출 목표 달성률 115%</li>
                                            <li>소셜 미디어 참여율 30% 증가</li>
                                            <li>신규 고객 확보 2,500명</li>
                                        </ul>
                                    </>
                                )}

                                {mode === "feedback" && (
                                    <>
                                        <h3 className="text-sm font-semibold mb-2">개선 제안</h3>
                                        <div className="space-y-3">
                                            <div>
                                                <p className="text-sm font-medium text-green-600 dark:text-green-400 mb-1">
                                                    ✓ 강점
                                                </p>
                                                <p className="text-sm text-text-primary-light dark:text-text-primary-dark">
                                                    구조가 명확하고 논리적 흐름이 잘 짜여져 있습니다.
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-yellow-600 dark:text-yellow-400 mb-1">
                                                    ⚠ 개선 가능
                                                </p>
                                                <p className="text-sm text-text-primary-light dark:text-text-primary-dark">
                                                    구체적인 수치와 데이터를 추가하면 더 설득력이 높아질 것입니다.
                                                </p>
                                            </div>
                                        </div>
                                    </>
                                )}

                                {mode === "compare" && (
                                    <>
                                        <h3 className="text-sm font-semibold mb-2">변경 사항</h3>
                                        <div className="space-y-2">
                                            <div className="p-2 rounded bg-red-50 dark:bg-red-900/20 border-l-2 border-red-500">
                                                <p className="text-xs text-red-700 dark:text-red-300">- 이전 버전 내용</p>
                                            </div>
                                            <div className="p-2 rounded bg-green-50 dark:bg-green-900/20 border-l-2 border-green-500">
                                                <p className="text-xs text-green-700 dark:text-green-300">+ 현재 버전 내용</p>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* AI 제안 사항 */}
                        <div className="p-3 rounded-lg bg-accent/10 border border-accent/20">
                            <p className="text-xs font-medium text-accent mb-1">💡 AI 제안</p>
                            <p className="text-xs text-text-primary-light dark:text-text-primary-dark">
                                이 내용을 바탕으로 실행 계획을 작성해보는 것은 어떨까요?
                            </p>
                        </div>
                    </div>
                )}
            </div>

            {/* 하단 액션 버튼 */}
            <div className="p-4 border-t border-border-light dark:border-border-dark space-y-2">
                <div className="flex gap-2">
                    <Button
                        variant="secondary"
                        size="sm"
                        className="flex-1"
                        onClick={handleCopy}
                    >
                        {copied ? <Check size={14} /> : <Copy size={14} />}
                        {copied ? "복사됨" : "복사"}
                    </Button>
                    <Button
                        variant="secondary"
                        size="sm"
                        className="flex-1"
                        onClick={handleRegenerate}
                    >
                        <RefreshCw size={14} />
                        재생성
                    </Button>
                </div>
                <Button variant="primary" size="md" className="w-full">
                    에디터에 적용
                </Button>
            </div>
        </aside>
    );
}