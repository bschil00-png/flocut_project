"use client";

import { useParams } from "next/navigation";
import RecordChunkList from "@/app/components/audio/RecordChunkList";

export default function RecordsPage() {
  const { sessionId } = useParams<{ sessionId: string }>();

  return (
    <div className="h-full flex flex-col bg-white dark:bg-slate-950">
      {/* 헤더 */}
      <div className="h-14 border-b flex items-center justify-between px-6">
        <h1 className="text-lg font-semibold">음성 녹음 기록</h1>
      </div>

      {/* 콘텐츠 */}
      <div className="flex-1 overflow-y-auto p-6">
        <RecordChunkList sessionId={Number(sessionId)} />
      </div>
    </div>
  );
}