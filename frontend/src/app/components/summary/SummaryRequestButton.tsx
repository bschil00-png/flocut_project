"use client";

import { useState, forwardRef } from "react";
import { Sparkles } from "lucide-react";
import { toast } from "sonner";

import Button from "@/app/components/ui/button/Button";
import ConfirmDialog from "@/app/components/ui/modal/ConfirmDialog";
import { useNoteSummaryCheck } from "@/hooks/summaries/useNoteSummaryCheck";

import {
  requestDocumentSummary,
  requestNoteSummary,
} from "@/lib/rest/summary/summary.rest";

interface Props extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "type"> {
  type: "document" | "note";
  targetId: number;
  sessionId: number;
  onRequested?: () => void | Promise<void>; //  Promise 지원
  size?: "sm" | "md" | "lg";
}

const SummaryRequestButton = forwardRef<HTMLButtonElement, Props>(
  ({ type, targetId, sessionId, onRequested, size = "sm", className = "", id, ...props }, ref) => {
    const [loading, setLoading] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const { checkSummary, loading: checkingLoading } = useNoteSummaryCheck();

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

        //  onRequested가 Promise면 await
        await onRequested?.();

      } catch (error) {
        console.error("요약 요청 실패:", error);
        toast.error("요약 요청에 실패했습니다.");
      } finally {
        setLoading(false);
        setShowConfirm(false);
      }
    };

    const handleClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
      props.onClick?.(e);

      if (e.defaultPrevented) return;

      if (type === "note") {
        const result = await checkSummary(targetId);

        if (result.hasSummary && result.status === "REQUESTED") {
          toast.info("이미 요약이 생성 중입니다. 잠시만 기다려 주세요.");
          await onRequested?.(); //  refetch
          return;
        }

        if (result.hasSummary && result.status === "COMPLETED") {
          setShowConfirm(true);
          return;
        }
      }

      await executeRequest();
    };

    const isProcessing = loading || checkingLoading;

    return (
      <>
        <Button
          {...props}
          ref={ref}
          id={id}
          variant="primary"
          size={size}
          onClick={handleClick}
          loading={isProcessing}
          disabled={isProcessing || props.disabled}
          className={className}
        >
          {isProcessing ? (
            <>
              <span className="hidden sm:inline">처리 중...</span>
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
);

SummaryRequestButton.displayName = "SummaryRequestButton";

export default SummaryRequestButton;