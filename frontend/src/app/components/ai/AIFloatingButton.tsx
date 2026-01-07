// components/ai/AIFloatingButton.tsx
"use client";

import { useState } from "react";
import { Sparkles, X, MessageSquare } from "lucide-react";

export default function AIFloatingButton() {
    const [chatOpen, setChatOpen] = useState(false);
    const [message, setMessage] = useState("");

    return (
        <>
            {/* 플로팅 버튼 */}
            {!chatOpen && (
                <button
                    onClick={() => setChatOpen(true)}
                    className="fixed bottom-8 right-8 w-14 h-14 rounded-full bg-gradient-to-br from-accent to-accent-hover text-white shadow-lg hover:shadow-xl transition-all hover:scale-110 flex items-center justify-center z-50"
                >
                    <Sparkles size={24} />
                </button>
            )}

            {/* AI 채팅 패널 */}
            {chatOpen && (
                <div className="fixed bottom-8 right-8 w-96 h-[500px] bg-background-light dark:bg-background-dark border border-border-light dark:border-border-dark rounded-xl shadow-2xl flex flex-col z-50 overflow-hidden">
                    {/* 헤더 */}
                    <div className="h-14 px-4 flex items-center justify-between border-b border-border-light dark:border-border-dark bg-gradient-to-r from-accent/10 to-accent-hover/10">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent to-accent-hover flex items-center justify-center">
                                <Sparkles size={16} className="text-white" />
                            </div>
                            <div>
                                <h3 className="text-sm font-semibold text-text-primary-light dark:text-text-primary-dark">
                                    AI 어시스턴트
                                </h3>
                                <p className="text-xs text-text-muted-light dark:text-text-muted-dark">
                                    무엇을 도와드릴까요?
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={() => setChatOpen(false)}
                            className="w-8 h-8 rounded-lg hover:bg-surface-light dark:hover:bg-surface-hover transition-colors flex items-center justify-center"
                        >
                            <X size={16} />
                        </button>
                    </div>

                    {/* 채팅 영역 */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                        {/* 시스템 메시지 */}
                        <div className="flex items-start gap-2">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent to-accent-hover flex items-center justify-center flex-shrink-0">
                                <Sparkles size={14} className="text-white" />
                            </div>
                            <div className="flex-1">
                                <div className="inline-block p-3 rounded-lg bg-surface-light dark:bg-surface-dark">
                                    <p className="text-sm text-text-primary-light dark:text-text-primary-dark">
                                        안녕하세요! 저는 FloCut AI 어시스턴트입니다. 문서 요약, 피드백, 비교 등을 도와드릴 수 있습니다.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* 빠른 액션 */}
                        <div className="flex flex-wrap gap-2">
                            <button className="px-3 py-2 rounded-lg bg-accent/10 text-accent text-xs font-medium hover:bg-accent/20 transition-colors">
                                현재 문서 요약
                            </button>
                            <button className="px-3 py-2 rounded-lg bg-accent/10 text-accent text-xs font-medium hover:bg-accent/20 transition-colors">
                                개선 제안
                            </button>
                            <button className="px-3 py-2 rounded-lg bg-accent/10 text-accent text-xs font-medium hover:bg-accent/20 transition-colors">
                                버전 비교
                            </button>
                        </div>
                    </div>

                    {/* 입력 영역 */}
                    <div className="p-4 border-t border-border-light dark:border-border-dark">
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                placeholder="메시지를 입력하세요..."
                                className="flex-1 h-10 px-3 rounded-lg border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark text-sm outline-none focus:ring-2 focus:ring-accent transition-all"
                                onKeyDown={(e) => {
                                    if (e.key === "Enter" && message.trim()) {
                                        // 메시지 전송 로직
                                        setMessage("");
                                    }
                                }}
                            />
                            <button
                                disabled={!message.trim()}
                                className="w-10 h-10 rounded-lg bg-accent text-white hover:bg-accent-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                            >
                                <MessageSquare size={16} />
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}