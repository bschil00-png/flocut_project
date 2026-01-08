"use client";

import { Loader2, FileText, Sparkles } from "lucide-react";
import { useFileText } from "@/hooks/files/useFileText";
import { useDocumentSummary } from "@/hooks/summaries/useDocumentSummary";
import { requestDocumentSummary } from "@/lib/rest/summary/summary.rest";
import Button from "@/app/components/ui/button/Button";
import { toast } from "sonner";

type Props = {
    fileId: string;
    sessionId: number;
};

export default function DocumentContent({ fileId, sessionId }: Props) {
    const id = Number(fileId);

    // 파일 원문 요청
    const { text, loading, error } = useFileText(id);

    // 요약 데이터 요청
    const { data: summaryData, refetch } = useDocumentSummary(id);
    const summary = summaryData?.documentSummaryByFileId;

    const handleSummaryRequest = async () => {
        try {
            await requestDocumentSummary({ fileId: id, sessionId });
            toast.success("요약 요청이 접수되었습니다.");
            refetch();
        } catch {
            toast.error("요약 요청 실패");
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full bg-background-light dark:bg-background-dark">
                <Loader2 className="animate-spin text-accent" size={32} />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center h-full p-6 text-center text-red-500 font-medium bg-background-light dark:bg-background-dark">
                파일 원문을 불러오지 못했습니다.
            </div>
        );
    }

    return (
        /* 핵심: 가시성이 강화된 custom-scrollbar 적용 */
        <div className="h-full overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-10 custom-scrollbar bg-background-light dark:bg-background-dark animate-fadeIn">

            {/* 원문 섹션 */}
            <section className="space-y-4">
                <div className="flex items-center gap-2 border-b border-border-light dark:border-border-dark pb-3">
                    <FileText size={20} className="text-accent shrink-0" />
                    <h4 className="font-bold text-lg text-text-primary-light dark:text-text-primary-dark">
                        원본 파일
                    </h4>
                </div>

                <div className="relative group">
                    <pre className="whitespace-pre-wrap text-sm leading-relaxed border border-border-light dark:border-border-dark rounded-2xl p-6 bg-surface-light dark:bg-surface-input text-text-primary-light dark:text-text-primary-dark transition-all duration-300 group-hover:border-accent/20 shadow-sm">
                        {text || "내용이 없습니다."}
                    </pre>
                </div>
            </section>

            {/* 요약 섹션 - 하단 여백(pb-10)을 주어 스크롤 끝을 명확히 함 */}
            <section className="space-y-4 pt-4 border-t border-border-light dark:border-border-dark pb-10">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Sparkles size={20} className="text-accent shrink-0" />
                        <h4 className="font-bold text-lg text-text-primary-light dark:text-text-primary-dark">
                            AI 요약
                        </h4>
                    </div>

                    {!summary && (
                        <Button
                            onClick={handleSummaryRequest}
                            size="sm"
                            className="rounded-xl shadow-lg shadow-accent/20"
                        >
                            <Sparkles size={14} />
                            요약 요청하기
                        </Button>
                    )}
                </div>

                {summary ? (
                    <div className="animate-fadeIn">
                        {summary.status === "COMPLETED" && (
                            <div className="border border-accent/10 rounded-2xl p-6 bg-accent-soft text-text-primary-light dark:text-text-primary-dark shadow-sm">
                                <p className="whitespace-pre-wrap text-sm leading-relaxed font-medium">
                                    {summary.summaryText}
                                </p>
                            </div>
                        )}

                        {summary.status === "REQUESTED" && (
                            <div className="flex items-center gap-3 p-8 bg-surface-light dark:bg-surface-input rounded-2xl border border-dashed border-border-light dark:border-border-dark justify-center">
                                <Loader2 className="animate-spin text-accent" size={20} />
                                <p className="text-sm font-medium text-text-muted-light dark:text-text-muted-dark">AI가 요약본을 생성하고 있습니다...</p>
                            </div>
                        )}

                        {summary.status === "FAILED" && (
                            <div className="p-6 bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-900/20 rounded-2xl text-red-600 dark:text-red-400 text-sm font-medium text-center">
                                요약 생성에 실패했습니다. 다시 시도해 주세요.
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="py-8 text-center border-2 border-dashed border-border-light dark:border-border-dark rounded-2xl">
                        <p className="text-sm text-text-muted-light dark:text-text-muted-dark px-2">
                            아직 생성된 요약본이 없습니다. 상단의 버튼을 눌러 요약을 시작하세요.
                        </p>
                    </div>
                )}
            </section>
        </div>
    );
}