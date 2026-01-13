// src/app/(workspace)/workspace/[sessionId]/documents/[id]/page.tsx
"use client";

import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, FileText, Sparkles, Loader2 } from "lucide-react";
import { useDocumentDetail } from "@/hooks/documents/useDocumentDetail";
import { requestDocumentSummary } from "@/lib/rest/summary/summary.rest";
import { toast } from "sonner";
import { useState } from "react";

export default function DocumentDetailPage() {
    const router = useRouter();
    const { sessionId, id } = useParams<{
        sessionId: string;
        id: string;
    }>();

    const fileId = Number(id);
    const { document, loading } = useDocumentDetail(fileId);
    const [summaryLoading, setSummaryLoading] = useState(false);

    const handleSummaryRequest = async () => {
        setSummaryLoading(true);
        try {
            await requestDocumentSummary({
                fileId,
                sessionId: Number(sessionId),
            });
            toast.success("요약 요청이 접수되었습니다.");
        } catch {
            toast.error("요약 요청 실패했습니다.");
        } finally {
            setSummaryLoading(false);
        }
    };

    const handleBackClick = () => {
        router.push(`/workspace/${sessionId}/documents`);
    };

    if (loading) {
        return (
            <div className="h-screen flex items-center justify-center bg-white dark:bg-surface-dark">
                <Loader2 className="animate-spin text-accent" size={48} />
            </div>
        );
    }

    if (!document) {
        return (
            <div className="h-screen flex items-center justify-center bg-white dark:bg-surface-dark">
                <p className="text-text-muted-light dark:text-text-muted-dark">
                    문서를 찾을 수 없습니다.
                </p>
            </div>
        );
    }

    return (
        <div className="h-screen flex flex-col bg-white dark:bg-surface-dark">
            {/* Header */}
            <div className="h-14 border-b border-border-light dark:border-border-dark flex items-center justify-between px-4 sm:px-6 flex-shrink-0">
                <div className="flex items-center gap-3">
                    <button
                        onClick={handleBackClick}
                        className="p-2 hover:bg-accent-soft rounded-lg transition-colors"
                    >
                        <ArrowLeft size={18} />
                    </button>
                    <div className="flex items-center gap-2 text-sm text-text-muted-light dark:text-text-muted-dark">
                        <FileText size={16} />
                        <span>문서 ID {document.fileId}</span>
                    </div>
                </div>

                <button
                    onClick={handleSummaryRequest}
                    disabled={summaryLoading}
                    className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-lg bg-accent text-white hover:bg-accent-hover transition-all disabled:opacity-50"
                >
                    {summaryLoading ? (
                        <Loader2 size={14} className="animate-spin" />
                    ) : (
                        <Sparkles size={14} />
                    )}
                    AI 요약 요청
                </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto px-6 sm:px-12 py-8">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-2xl font-semibold text-text-primary-light dark:text-text-primary-dark mb-4">
                        {document.fileName}
                    </h1>

                    {/* 추가 정보는 나중에 구현 */}
                    <div className="text-sm text-text-muted-light dark:text-text-muted-dark">
                        {/*<p>파일 크기: {document.fileSize ? `${(document.fileSize / 1024).toFixed(2)} KB` : "알 수 없음"}</p>*/}
                        {/*<p>업로드 날짜: {document.uploadDate || "알 수 없음"}</p>*/}
                    </div>
                </div>
            </div>
        </div>
    );
}
