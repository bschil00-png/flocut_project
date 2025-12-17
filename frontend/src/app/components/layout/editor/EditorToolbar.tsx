// components/editor/EditorToolbar.tsx
"use client";

import {
    Bold,
    Italic,
    Underline,
    Code,
    Link as LinkIcon,
    List,
    ListOrdered,
    Quote,
    Sparkles,
    MessageSquare,
    GitCompare,
    Clock,
    MessageCircle,
    Info,
    MoreHorizontal,
    ChevronRight,
} from "lucide-react";

interface EditorToolbarProps {
    onOpenContextPanel: (
        mode:
            | "properties"
            | "ai-summary"
            | "ai-feedback"
            | "ai-compare"
            | "versions"
            | "comments"
            | "calendar"
    ) => void;
    contextPanelOpen: boolean;
}

export default function EditorToolbar({
                                          onOpenContextPanel,
                                          contextPanelOpen,
                                      }: EditorToolbarProps) {
    return (
        <div className="h-14 border-b border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark">
            <div className="h-full flex items-center justify-between px-6">
                {/* 좌측: 텍스트 포맷팅 */}
                <div className="flex items-center gap-1">
                    <div className="flex items-center gap-0.5 pr-2 border-r border-border-light dark:border-border-dark">
                        <button className="p-2 hover:bg-surface-hover dark:hover:bg-surface-input rounded transition-colors">
                            <Bold size={16} />
                        </button>
                        <button className="p-2 hover:bg-surface-hover dark:hover:bg-surface-input rounded transition-colors">
                            <Italic size={16} />
                        </button>
                        <button className="p-2 hover:bg-surface-hover dark:hover:bg-surface-input rounded transition-colors">
                            <Underline size={16} />
                        </button>
                        <button className="p-2 hover:bg-surface-hover dark:hover:bg-surface-input rounded transition-colors">
                            <Code size={16} />
                        </button>
                    </div>

                    <div className="flex items-center gap-0.5 px-2 border-r border-border-light dark:border-border-dark">
                        <button className="p-2 hover:bg-surface-hover dark:hover:bg-surface-input rounded transition-colors">
                            <LinkIcon size={16} />
                        </button>
                        <button className="p-2 hover:bg-surface-hover dark:hover:bg-surface-input rounded transition-colors">
                            <List size={16} />
                        </button>
                        <button className="p-2 hover:bg-surface-hover dark:hover:bg-surface-input rounded transition-colors">
                            <ListOrdered size={16} />
                        </button>
                        <button className="p-2 hover:bg-surface-hover dark:hover:bg-surface-input rounded transition-colors">
                            <Quote size={16} />
                        </button>
                    </div>
                </div>

                {/* 우측: AI 기능 & 컨텍스트 패널 */}
                <div className="flex items-center gap-2">
                    {/* AI 기능 그룹 */}
                    <div className="flex items-center gap-1 pr-2 border-r border-border-light dark:border-border-dark">
                        <button
                            onClick={() => onOpenContextPanel("ai-summary")}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md hover:bg-accent-soft text-accent transition-colors text-sm font-medium"
                        >
                            <Sparkles size={14} />
                            요약
                        </button>
                        <button
                            onClick={() => onOpenContextPanel("ai-feedback")}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md hover:bg-accent-soft text-accent transition-colors text-sm font-medium"
                        >
                            <MessageSquare size={14} />
                            피드백
                        </button>
                        <button
                            onClick={() => onOpenContextPanel("ai-compare")}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md hover:bg-accent-soft text-accent transition-colors text-sm font-medium"
                        >
                            <GitCompare size={14} />
                            비교
                        </button>
                    </div>

                    {/* 컨텍스트 패널 토글 */}
                    <div className="flex items-center gap-1">
                        <button
                            onClick={() => onOpenContextPanel("versions")}
                            className={`p-2 rounded transition-colors ${
                                contextPanelOpen
                                    ? "bg-accent text-white"
                                    : "hover:bg-surface-hover dark:hover:bg-surface-input"
                            }`}
                            title="버전 기록"
                        >
                            <Clock size={16} />
                        </button>
                        <button
                            onClick={() => onOpenContextPanel("comments")}
                            className={`p-2 rounded transition-colors ${
                                contextPanelOpen
                                    ? "bg-accent text-white"
                                    : "hover:bg-surface-hover dark:hover:bg-surface-input"
                            }`}
                            title="댓글"
                        >
                            <MessageCircle size={16} />
                        </button>
                        <button
                            onClick={() => onOpenContextPanel("properties")}
                            className={`p-2 rounded transition-colors ${
                                contextPanelOpen
                                    ? "bg-accent text-white"
                                    : "hover:bg-surface-hover dark:hover:bg-surface-input"
                            }`}
                            title="속성"
                        >
                            <Info size={16} />
                        </button>
                        <button className="p-2 hover:bg-surface-hover dark:hover:bg-surface-input rounded transition-colors">
                            <MoreHorizontal size={16} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}