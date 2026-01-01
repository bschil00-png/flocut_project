"use client";

import { useParams } from "next/navigation";
import { FileText } from "lucide-react";
import { useDocumentDetail } from "@/hooks/documents/useDocumentDetail";

export default function DocumentDetailPage() {
  const { fileId } = useParams<{ fileId: string }>();
  const { document, loading } = useDocumentDetail(Number(fileId));

  if (loading) {
    return <p className="p-8">불러오는 중...</p>;
  }

  if (!document) {
    return <p className="p-8">문서를 찾을 수 없습니다.</p>;
  }

  return (
    <div className="flex h-screen bg-white dark:bg-gray-950">
      <div className="w-16 border-r border-gray-200 dark:border-gray-800" />

      <main className="flex-1 overflow-y-auto px-8 py-6">
        <div className="max-w-3xl mx-auto space-y-6">

          {/* 상단 메타 */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <FileText size={16} />
              문서 · ID {document.fileId}
            </div>

            <h1 className="text-2xl font-semibold">
              {document.fileName}
            </h1>

            <p className="text-sm text-gray-400">
              {document.createdDate}
            </p>
          </div>

          {/* 요약 */}
          <section className="border rounded-md p-4 space-y-2">
            <h2 className="text-sm font-semibold">
              AI 요약 ({document.summaryCount})
            </h2>

            {document.summaryCount === 0 ? (
              <p className="text-sm text-gray-500">
                아직 생성된 요약이 없습니다.
              </p>
            ) : (
              document.summaries.map(summary => (
                <div
                  key={summary.summaryId}
                  className="text-sm leading-relaxed text-gray-700 dark:text-gray-300 border-t pt-2"
                >
                  {summary.summaryText}
                </div>
              ))
            )}
          </section>

        </div>
      </main>
    </div>
  );
}
