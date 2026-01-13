"use client";

import { Loader2, FileText } from "lucide-react";
import { useFileText } from "@/hooks/files/useFileText";
import SummaryRequestButton from "@/app/components/summary/SummaryRequestButton";

type Props = {
    fileId: string;
    sessionId: number;
};

export default function DocumentContent({ fileId, sessionId }: Props) {
    const id = Number(fileId);
    const { text, loading, error } = useFileText(id);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full">
                <Loader2 className="animate-spin text-accent" size={32} />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center h-full text-red-500">
                파일 원문을 불러오지 못했습니다.
            </div>
        );
    }

    return (
        <div className="h-full overflow-y-auto p-6 space-y-6 custom-scrollbar">
            <section className="space-y-4">
                {/* 헤더 */}
                <div className="flex items-center justify-between border-b border-border-light dark:border-border-dark pb-3">
                    <div className="flex items-center gap-2">
                        <FileText size={20} className="text-accent" />
                        <h4 className="font-bold text-lg">원본 파일</h4>
                    </div>

                    <SummaryRequestButton
                        type="document"
                        targetId={id}
                        sessionId={sessionId}
                    />
                </div>

                <pre
                    className="
            whitespace-pre-wrap
            text-sm leading-relaxed
            border border-border-light dark:border-border-dark
            rounded-2xl p-6
            bg-surface-light dark:bg-surface-dark
            text-text-primary-light dark:text-text-primary-dark
          "
                >
          {text || "내용이 없습니다."}
        </pre>
            </section>
        </div>
    );
}
