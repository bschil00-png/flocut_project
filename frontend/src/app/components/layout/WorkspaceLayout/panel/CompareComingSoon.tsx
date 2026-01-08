"use client";

import { GitCompare, Bell } from "lucide-react";
import Button from "@/app/components/ui/button/Button";

// ============================================
// Main Component
// ============================================

export default function CompareComingSoon() {
    return (
        <div className="flex flex-col items-center justify-center h-full p-6 text-center">

            {/* 아이콘 */}
            <div className="w-16 h-16 rounded-full bg-accent-soft flex items-center justify-center mb-4">
                <GitCompare size={32} className="text-accent" />
            </div>

            {/* 제목 */}
            <h3 className="text-xl font-semibold text-text-primary-light dark:text-text-primary-dark mb-2">
                문서 비교 기능
            </h3>

            {/* 설명 */}
            <p className="text-sm text-text-muted-light dark:text-text-muted-dark mb-6 max-w-md">
                여러 문서의 변경사항과 흐름을 AI가 분석해 비교해드립니다.
                <br />
                현재 개발 중이며 곧 업데이트 예정입니다.
            </p>

            {/* 업데이트 알림 신청 */}
            <div className="flex flex-col items-center gap-3">
                <Button variant="secondary" size="sm">
                    <Bell size={14} />
                    업데이트 알림 받기
                </Button>

                <p className="text-xs text-text-muted-light dark:text-text-muted-dark">
                    출시 시 알림을 보내드립니다
                </p>
            </div>

            {/* 예정 기능 목록 */}
            <div className="mt-8 w-full max-w-md">
                <h4 className="text-sm font-semibold text-text-primary-light dark:text-text-primary-dark mb-3 text-left">
                    준비 중인 기능
                </h4>
                <ul className="space-y-2 text-left">
                    <FeatureItem text="회차별 문서 변경 추적" />
                    <FeatureItem text="AI 기반 핵심 변경사항 요약" />
                    <FeatureItem text="추가/삭제/수정 내용 비교" />
                    <FeatureItem text="문서 흐름 변화 분석" />
                </ul>
            </div>
        </div>
    );
}

// ============================================
// Sub Components
// ============================================

function FeatureItem({ text }: { text: string }) {
    return (
        <li className="flex items-start gap-2 text-sm text-text-muted-light dark:text-text-muted-dark">
            <span className="w-1.5 h-1.5 rounded-full bg-accent mt-1.5 flex-shrink-0" />
            <span>{text}</span>
        </li>
    );
}