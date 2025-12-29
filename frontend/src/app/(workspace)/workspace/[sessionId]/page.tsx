// app/(workspace)/workspace/[sessionId]/page.tsx
"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

export default function SessionEntryPage() {
    const { sessionId } = useParams<{ sessionId: string }>();
    const router = useRouter();

    useEffect(() => {
        router.replace(`/workspace/${sessionId}/notes`);
    }, [router, sessionId]);

    return (
        <div className="h-full flex items-center justify-center text-sm text-text-muted-light">
            워크스페이스 로딩 중...
        </div>
    );
}
