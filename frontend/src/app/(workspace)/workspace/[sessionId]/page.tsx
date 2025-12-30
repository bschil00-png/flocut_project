// app/(workspace)/workspace/[sessionId]/page.tsx
"use client";

import { useParams } from "next/navigation";
import Link from "next/link";

export default function SessionHomePage() {
  const { sessionId } = useParams<{ sessionId: string }>();

  return (
    <div className="p-8 space-y-6">
      <h1 className="text-2xl font-bold">
        세션 #{sessionId}
      </h1>

      <div className="grid grid-cols-3 gap-4">
        <Link
          href={`/workspace/${sessionId}/notes`}
          className="border rounded-md p-4 hover:bg-gray-50"
        >
           노트
        </Link>

        <Link
          href={`/workspace/${sessionId}/documents`}
          className="border rounded-md p-4 hover:bg-gray-50"
        >
           문서
        </Link>

        <Link
          href={`/workspace/${sessionId}/audio`}
          className="border rounded-md p-4 hover:bg-gray-50"
        >
           음성
        </Link>
      </div>
    </div>
  );
}
