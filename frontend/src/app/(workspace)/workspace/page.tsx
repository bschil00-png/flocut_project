// app/(workspace)/workspace/page.tsx
"use client";

import Link from "next/link";
import { useSessions } from "@/hooks/sessions/useSessions";
import { Folder } from "lucide-react";

export default function WorkspaceHomePage() {
    const { sessions, loading } = useSessions();

    return (
        <div className="px-10 py-8 overflow-y-auto">
            <h1 className="text-2xl font-semibold">워크스페이스</h1>
            <p className="mt-1 text-sm text-text-muted-light">
                작업할 세션을 선택하세요.
            </p>

            {loading && <p className="mt-4">불러오는 중...</p>}

            <ul className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {sessions.map((s) => (
                    <li key={s.sessionId}>
                        <Link
                            href={`/workspace/${s.sessionId}`}
                            className="block p-4 border rounded-lg hover:bg-accent-soft"
                        >
                            <div className="flex items-center gap-2">
                                <Folder size={18} />
                                <span className="font-medium">{s.sessionTitle}</span>
                            </div>
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}
