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

    //  파일 존재 검증 제거
    // fileId 기준으로 바로 원문 요청
    const { text, loading, error } = useFileText(id);

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
            <div className="flex items-center justify-center h-full">
                <Loader2 className="animate-spin" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-6 text-center text-red-500">
                파일 원문을 불러오지 못했습니다.
            </div>
        );
    }

    return (
        <div className="h-full overflow-y-auto p-6 space-y-6">
            {/* 원문 */}
            <section>
                <h4 className="font-medium mb-3 flex items-center gap-2">
                    <FileText size={16} />
                    원본 파일
                </h4>

                <pre className="whitespace-pre-wrap text-sm border rounded p-4 bg-slate-50">
          {text || "내용이 없습니다."}
        </pre>
            </section>

            {/* 요약 요청 */}
            {!summary && (
                <Button onClick={handleSummaryRequest} size="sm">
                    <Sparkles size={14} />
                    AI 요약 요청
                </Button>
            )}

            {/* 요약 결과 */}
            {summary && (
                <section>
                    <h4 className="font-medium mb-3">AI 요약</h4>

                    {summary.status === "COMPLETED" && (
                        <div className="border rounded p-4 bg-blue-50">
                            <p className="whitespace-pre-wrap text-sm">
                                {summary.summaryText}
                            </p>
                        </div>
                    )}

                    {summary.status === "REQUESTED" && <p>요약 생성 중...</p>}
                    {summary.status === "FAILED" && <p>요약 실패</p>}
                </section>
            )}
        </div>
    );
}
