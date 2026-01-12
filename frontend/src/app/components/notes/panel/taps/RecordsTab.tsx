"use client";

import RecordChunkList from "@/app/components/audio/RecordChunkList";

interface Props {
  sessionId: number;
}

export default function RecordsTab({ sessionId }: Props) {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">음성 녹음 기록</h3>
        <p className="text-sm text-text-muted-light dark:text-text-muted-dark">
          이 세션에서 녹음한 음성 조각들입니다
        </p>
      </div>

      <RecordChunkList sessionId={sessionId} />
    </div>
  );
}