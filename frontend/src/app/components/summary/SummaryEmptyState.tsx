
"use client";

import { FileText, Sparkles } from "lucide-react";
import SummaryRequestButton from "./SummaryRequestButton";

type Props = {
    type: "document" | "note";
    targetId: number;
    sessionId: number;
    onRequested: () => void;
};

export default function SummaryEmptyState({
                                              type,
                                              targetId,
                                              sessionId,
                                              onRequested,
                                          }: Props) {
    return (
        <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
            {/* 아이콘 */}
            <div className="relative mb-6">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-accent/10 to-accent/5 flex items-center justify-center">
                    <FileText size={36} className="text-accent/40" />
                </div>
                <div className="absolute -top-2 -right-2 w-10 h-10 rounded-full bg-accent flex items-center justify-center ">
                    <Sparkles size={20} className="text-white" />
                </div>
            </div>

            {/* 제목 */}
            <h3 className="text-lg font-semibold text-text-primary-light dark:text-text-primary-dark mb-2">
                AI 요약을 생성해보세요
            </h3>

            {/* 설명 */}
            <p className="text-sm text-text-muted-light dark:text-text-muted-dark max-w-md mb-6">
                AI가 문서의 핵심 내용을 분석하여
                <br />
                주요 포인트와 요약을 제공합니다.
            </p>

            {/* 버튼 */}
            <SummaryRequestButton
                type={type}
                targetId={targetId}
                sessionId={sessionId}
                onRequested={onRequested}
                size="md"
            />

            {/* 기능 안내 */}
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-md w-full">
                <FeatureCard
                    icon={<Sparkles size={16} />}
                    title="핵심 요약"
                    description="주요 내용을 한눈에"
                />
                <FeatureCard
                    icon={<FileText size={16} />}
                    title="구조화"
                    description="섹션별로 정리"
                />
            </div>
        </div>
    );
}

function FeatureCard({
                         icon,
                         title,
                         description,
                     }: {
    icon: React.ReactNode;
    title: string;
    description: string;
}) {
    return (
        <div className="p-3 rounded-lg border border-border-light dark:border-border-dark bg-white dark:bg-surface-dark">
            <div className="flex items-start gap-2">
                <div className="flex-shrink-0 text-accent mt-0.5">{icon}</div>
                <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-text-primary-light dark:text-text-primary-dark">
                        {title}
                    </p>
                    <p className="text-xs text-text-muted-light dark:text-text-muted-dark">
                        {description}
                    </p>
                </div>
            </div>
        </div>
    );
}