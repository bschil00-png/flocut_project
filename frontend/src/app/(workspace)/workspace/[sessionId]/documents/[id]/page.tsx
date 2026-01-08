"use client";

import { useParams } from "next/navigation";
import { FileText } from "lucide-react";
import { useDocumentDetail } from "@/hooks/documents/useDocumentDetail";
import {string} from "zod";
import {requestDocumentSummary} from "@/lib/rest/summary/summary.rest";
import {toast} from "sonner";

export default function DocumentDetailPage() {

  // 요약 요청
  const {sessionId, id} = useParams<{
    sessionId: string;
    id: string;
  }>();

  const fileId = Number(id);
  const { document, loading } = useDocumentDetail(Number(fileId));

    const handleSummaryRequest = async () => {
        try {
            await requestDocumentSummary({
                fileId,
                sessionId: Number(sessionId),
                // roundNo 제거
            });
            toast.success("요약 요청이 접수되었습니다.")
        } catch {
            toast.error("요약 요약 실패했습니다.")
        }
    };

  if (loading) {
    return <p className="p-8">불러오는 중...</p>;
  }

  if (!document) {
    return <p className="p-8">문서를 찾을 수 없습니다.</p>;
  }

  return (
    <div className="flex h-screen">
      <main className="flex-1 px-8 py-6 space-y-6">

        {/* 메타 */}
        <div>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <FileText size={16} />
            문서 ID {document.fileId}
          </div>
          <h1 className="text-2xl font-semibold">
            {document.fileName}
          </h1>
        </div>

        {/* 요약 요청 버튼 */}
        <button
          onClick={handleSummaryRequest}
          className="px-4 py-2 rounded-md bg-accent text-white text-sm"
        >
          AI 요약 요청
        </button>

        {/* 기존 요약 영역은 그대로 두되,
            나중에 ContextPanel로 이동 */}
      </main>
    </div>
  );
}
