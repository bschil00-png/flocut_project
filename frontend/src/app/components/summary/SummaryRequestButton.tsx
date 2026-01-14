"use client";

import { useState } from "react";
import { Sparkles, Loader2 } from "lucide-react";
import { toast } from "sonner";

import Button from "@/app/components/ui/button/Button";
import ConfirmDialog from "@/app/components/ui/modal/ConfirmDialog";
import { useNoteSummaryCheck } from "@/hooks/summaries/useNoteSummaryCheck";

import {
    requestDocumentSummary,
    requestNoteSummary,
} from "@/lib/rest/summary/summary.rest";

interface Props {
    type: "document" | "note";
    targetId: number;
    sessionId: number;
    onRequested?: () => void;
    size?: "sm" | "md" | "lg";
    className?: string;
}

export default function SummaryRequestButton({
                                                 type,
                                                 targetId,
                                                 sessionId,
                                                 onRequested,
                                                 size = "sm",
                                                 className = "",
                                             }: Props) {
    const [loading, setLoading] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const { checkSummary, loading: checkingLoading } = useNoteSummaryCheck();

    const handleClick = async () => {
        // 노트일 경우에만 기존 요약 확인
        if (type === "note") {
            const result = await checkSummary(targetId);

            // status가 COMPLETED일 때만 확인 다이얼로그 표시
            if (result.hasSummary && result.status === "COMPLETED") {
                setShowConfirm(true);
                return;
            }
        }

        // 바로 요약 요청
        await executeRequest();
    };

    const executeRequest = async () => {
        setLoading(true);
        try {
            if (type === "document") {
                await requestDocumentSummary({
                    fileId: targetId,
                    sessionId,
                });
            } else {
                await requestNoteSummary(targetId);
            }

            toast.success("AI 요약 요청이 접수되었습니다.");
            onRequested?.();
        } catch (error) {
            console.error("요약 요청 실패:", error);
            toast.error("요약 요청 실패");
        } finally {
            setLoading(false);
            setShowConfirm(false);
        }
    };

    const isProcessing = loading || checkingLoading;

    return (
        <>
            <Button
                variant="primary"
                size={size}
                onClick={handleClick}
                loading={isProcessing}
                disabled={isProcessing}
                className={className}
            >
                {isProcessing ? (
                    <>
                        <Loader2 size={14} className="animate-spin" />
                        <span className="hidden sm:inline">확인 중...</span>
                    </>
                ) : (
                    <>
                        <Sparkles size={14} />
                        <span className="hidden sm:inline">AI 요약</span>
                    </>
                )}
            </Button>

            <ConfirmDialog
                open={showConfirm}
                title="새 요약 생성"
                message={`이미 생성된 요약이 있습니다.\n새로운 요약을 요청하면 기존 요약이 삭제됩니다.\n계속하시겠습니까?`}
                confirmText="새 요약 생성"
                cancelText="취소"
                onConfirm={executeRequest}
                onClose={() => setShowConfirm(false)}
            />
        </>
    );
}