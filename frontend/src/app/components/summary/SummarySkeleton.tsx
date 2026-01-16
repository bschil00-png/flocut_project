"use client";

export default function SummarySkeleton() {
    return (
        <div className="space-y-6 p-4 animate-pulse">
            {/* 헤더 스켈레톤 */}
            <div className="flex items-center justify-between">
                <div className="h-8 w-32 bg-surface-light dark:bg-surface-dark rounded-lg" />
                <div className="h-8 w-24 bg-surface-light dark:bg-surface-dark rounded-lg" />
            </div>

            {/* 요약 버전 스켈레톤 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {[1, 2, 3].map((i) => (
                    <div
                        key={i}
                        className="h-20 bg-surface-light dark:bg-surface-dark rounded-xl"
                    />
                ))}
            </div>

            {/* 본문 스켈레톤 */}
            <div className="space-y-4">
                <div className="h-32 bg-surface-light dark:bg-surface-dark rounded-xl" />
                <div className="h-48 bg-surface-light dark:bg-surface-dark rounded-xl" />
                <div className="h-40 bg-surface-light dark:bg-surface-dark rounded-xl" />
            </div>
        </div>
    );
}