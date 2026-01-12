// components/summary/SummaryRequestButton.tsx
"use client";

import { useState } from "react";
import { Sparkles } from "lucide-react";
import { toast } from "sonner";
import Button from "@/app/components/ui/button/Button";
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

  const handleRequest = async () => {
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
    } catch {
      toast.error("요약 요청 실패");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      variant="primary"
      size={size}
      onClick={handleRequest}
      loading={loading}
      disabled={loading}
      className={className}
    >
      <Sparkles size={14} />
      AI 요약
    </Button>
  );
}
