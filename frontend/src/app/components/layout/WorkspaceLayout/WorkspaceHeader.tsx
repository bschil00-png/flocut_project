"use client";

import { Sparkles, Mic, GitCompare, Settings } from "lucide-react";
import Link from "next/link";
import IconButton from "@/app/components/ui/icon-button/IconButton";

interface WorkspaceHeaderProps {
    title?: string;
    isSaving?: boolean;
    onSummary?: () => void;
    onVoice?: () => void;
    onCompare?: () => void;
}

export default function WorkspaceHeader({
                                            title = "FLOCUT WORKSPACE",
                                            isSaving = false,
                                            onSummary,
                                            onVoice,
                                            onCompare,
                                        }: WorkspaceHeaderProps) {
    return (
        <header className="h-14 flex items-center justify-between px-6 border-b border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark">
            {/* 왼쪽 영역 */}
            <div className="flex items-center gap-3 min-w-0">
                <Link href="/public" className="hover:opacity-80 transition-opacity">
                    <h1 className="text-base font-semibold truncate text-text-primary-light dark:text-text-primary-dark">
                        {title}
                    </h1>
                </Link>
                <span className="text-xs text-text-muted-light dark:text-text-muted-dark">
          {isSaving ? "저장 중..." : "저장됨"}
        </span>
            </div>

            {/* 오른쪽 액션 버튼 */}
            <div className="flex items-center gap-2">
                <IconButton
                    icon={<Sparkles size={18} />}
                    onClick={onSummary}
                />
                <IconButton
                    icon={<Mic size={18} />}
                    onClick={onVoice}
                />
                <IconButton
                    icon={<GitCompare size={18} />}
                    onClick={onCompare}
                />
                <IconButton
                    icon={<Settings size={18} />}
                />
            </div>
        </header>
    );
}