"use client";

import { useSessions } from "@/hooks/sessions/useSessions";
import { useRouter } from "next/navigation";
import { FolderOpen, Loader2 } from "lucide-react";

export default function SessionList() {
    const router = useRouter();

    const {
        sessions,
        loading,
        pageInfo,
        loadMore,
    } = useSessions(12);

    return (
        <div className="p-6 space-y-6">
            {/* =========================
          Header
         ========================= */}
            <div className="flex items-center justify-between">
                <h1 className="text-xl font-bold">내 세션</h1>
                <span className="text-sm text-text-muted-light">
          총 {pageInfo?.totalElements ?? 0}개
        </span>
            </div>

            {/* =========================
          Session List
         ========================= */}
            {sessions.length === 0 && !loading ? (
                <div className="py-12 text-center text-sm text-text-muted-light">
                    아직 세션이 없습니다
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {sessions.map((session) => (
                        <button
                            key={session.sessionId}
                            onClick={() =>
                                router.push(`/workspace/${session.sessionId}`)
                            }
                            className="
                p-4 rounded-xl border
                bg-white dark:bg-surface-dark
                hover:bg-accent-soft
                transition
                text-left
              "
                        >
                            <div className="flex items-center gap-2 mb-2">
                                <FolderOpen size={16} className="text-accent" />
                                <span className="font-medium truncate">
                  {session.sessionTitle}
                </span>
                            </div>

                            {session.description && (
                                <p className="text-sm text-text-muted-light line-clamp-2">
                                    {session.description}
                                </p>
                            )}
                        </button>
                    ))}
                </div>
            )}

            {/* =========================
          Loading
         ========================= */}
            {loading && (
                <div className="flex justify-center py-4">
                    <Loader2 className="animate-spin text-accent" />
                </div>
            )}

            {/* =========================
          Load More Button
         ========================= */}
            {pageInfo?.hasNext && !loading && (
                <div className="flex justify-center pt-6">
                    <button
                        onClick={loadMore}
                        className="
              px-4 py-2 rounded-lg
              text-sm font-medium
              bg-accent-soft
              hover:bg-accent
              hover:text-white
              transition
            "
                    >
                        더 보기
                    </button>
                </div>
            )}
        </div>
    );
}
