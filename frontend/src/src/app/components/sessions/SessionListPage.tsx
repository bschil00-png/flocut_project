"use client";

import { useMemo, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
    FolderOpen,
    Plus,
    Clock,
    SortAsc,
    SortDesc,
} from "lucide-react";

import { useSessions } from "@/hooks/sessions/useSessions";
import Card from "@/app/components/ui/card/Card";
import Button from "@/app/components/ui/button/Button";
import Pagination from "@/app/components/ui/pagination/Pagination";
import SearchInput from "@/app/components/ui/input/SearchInput";
import ToggleGroup from "@/app/components/ui/toggle/ToggleGroup";

export default function SessionListPage({ pageSize = 10 }: { pageSize?: number }) {
    const router = useRouter();
    const { sessions, loading } = useSessions();

    const [searchQuery, setSearchQuery] = useState("");
    const [sortBy, setSortBy] = useState<"latest" | "oldest">("latest");
    const [page, setPage] = useState(0);

    /** 🔹 검색/정렬 변경 시 페이지 초기화 */
    useEffect(() => {
        setPage(0);
    }, [searchQuery, sortBy]);

    /** 🔹 필터 + 정렬 */
    const filteredSessions = useMemo(() => {
        let result = [...sessions];

        if (searchQuery) {
            const q = searchQuery.toLowerCase();
            result = result.filter(
                s =>
                    s.sessionTitle.toLowerCase().includes(q) ||
                    s.description?.toLowerCase().includes(q)
            );
        }

        result.sort((a, b) => {
            const dateA = new Date(a.moddate || a.regdate).getTime();
            const dateB = new Date(b.moddate || b.regdate).getTime();
            return sortBy === "latest" ? dateB - dateA : dateA - dateB;
        });

        return result;
    }, [sessions, searchQuery, sortBy]);

    /** 🔹 페이지 보정 (필터 결과가 줄었을 때) */
    const totalPages = Math.max(1, Math.ceil(filteredSessions.length / pageSize));

    useEffect(() => {
        if (page > totalPages - 1) {
            setPage(totalPages - 1);
        }
    }, [page, totalPages]);

    /** 🔹 현재 페이지 데이터 */
    const paginatedSessions = useMemo(() => {
        const start = page * pageSize;
        return filteredSessions.slice(start, start + pageSize);
    }, [filteredSessions, page, pageSize]);

    if (loading) {
        return <div className="p-8 animate-pulse h-96 rounded-xl bg-surface-light dark:bg-surface-dark" />;
    }

    return (
        <div className="space-y-6 max-w-[1200px] mx-auto py-8 px-4">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold">세션 라이브러리</h1>
                    <p className="text-sm text-text-muted-light mt-1">
                        총 {filteredSessions.length}개의 분석 세션
                    </p>
                </div>

                <Button onClick={() => router.push("/workspace")} className="gap-2">
                    <Plus size={16} /> 새 세션 시작하기
                </Button>
            </div>

            {/* Search / Sort */}
            <Card className="p-4">
                <div className="flex flex-col md:flex-row gap-4 justify-between">
                    <SearchInput
                        value={searchQuery}
                        onChange={setSearchQuery}
                        placeholder="세션 제목 또는 설명으로 검색"
                        className="md:w-96"
                    />

                    <ToggleGroup
                        value={sortBy}
                        onChange={(value) => setSortBy(value as "latest" | "oldest")}
                        options={[
                            { value: "latest", label: "최신순" },
                            { value: "oldest", label: "과거순" },
                        ]}
                    />
                </div>
            </Card>

            {/* List */}
            <Card padding="none" className="overflow-hidden">
                <table className="w-full">
                    <tbody>
                    {paginatedSessions.map((session) => (
                        <tr
                            key={session.sessionId}
                            onClick={() => router.push(`/workspace/${session.sessionId}`)}
                            className="cursor-pointer hover:bg-surface-light transition-colors"
                        >
                            <td className="px-6 py-5">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-accent-soft flex items-center justify-center text-accent">
                                        <FolderOpen size={24} />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="font-bold truncate">{session.sessionTitle}</p>
                                        {session.description && (
                                            <p className="text-xs text-text-muted-light truncate">
                                                {session.description}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </td>

                            <td className="px-6 py-5 text-sm text-right">
                                <div className="flex flex-col items-end">
                    <span className="flex items-center gap-1">
                      <Clock size={14} />
                        {new Date(session.moddate || session.regdate).toLocaleDateString()}
                    </span>
                                    <span className="text-[10px] text-text-muted-light">
                      {new Date(session.moddate || session.regdate).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                      })}
                    </span>
                                </div>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>

                {totalPages > 1 && (
                    <div className="p-6 border-t flex justify-center">
                        <Pagination
                            pageNumber={page}
                            totalPages={totalPages}
                            hasNext={page < totalPages - 1}
                            hasPrevious={page > 0}
                            isFirst={page === 0}
                            isLast={page === totalPages - 1}
                            onChange={setPage}
                        />
                    </div>
                )}
            </Card>
        </div>
    );
}
