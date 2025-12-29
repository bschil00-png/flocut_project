"use client";

import { useParams } from "next/navigation";
import { FileText, Mic, GitCompare } from "lucide-react";

export default function DocumentDetailPage() {
  const { documentId } = useParams();

  return (
    <div className="flex h-screen bg-white dark:bg-gray-950">
      {/* 좌측 여백 (나중에 사이드바 재사용 가능) */}
      <div className="w-16 border-r border-gray-200 dark:border-gray-800" />

      {/* 본문 */}
      <main className="flex-1 overflow-y-auto px-8 py-6">
        <div className="max-w-3xl mx-auto space-y-6">

          {/* 상단 메타 */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <FileText size={16} />
              문서 요약 · ID {documentId}
            </div>

            <h1 className="text-2xl font-semibold">
              플로컷 회의 요약 #{documentId}
            </h1>

            <p className="text-sm text-gray-400">
              2025.12.16 · 14:30
            </p>
          </div>

          {/* 요약 결과 */}
          <section className="border border-gray-200 dark:border-gray-800 rounded-md p-4">
            <h2 className="text-sm font-semibold mb-2">
              AI 요약 결과
            </h2>

            <p className="text-sm leading-relaxed text-gray-700 dark:text-gray-300">
              이 문서는 FloCut의 AI 요약 기능을 통해 생성된 회의 요약입니다.
              문서 업로드, 음성 변환, 비교 요약 기능이 하나의 흐름으로
              통합되어 제공됩니다.
            </p>
          </section>

          {/* 액션 버튼 */}
          <div className="flex gap-2">
            <button className="px-3 py-2 text-sm border rounded-md">
              다시 요약
            </button>
            <button className="px-3 py-2 text-sm border rounded-md">
              비교 추가
            </button>
            <button className="px-3 py-2 text-sm border rounded-md">
              피드백
            </button>
          </div>

        </div>
      </main>
    </div>
  );
}
