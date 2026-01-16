"use client";

import { useMemo, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
    Folder,
    FolderOpen,
    Clock,
    Calendar,
    SortAsc,
    SortDesc,
} from "lucide-react";

import { useSessions } from "@/hooks/sessions/useSessions";
import Card from "@/app/components/ui/card/Card";
import SearchInput from "@/app/components/ui/input/SearchInput";
import ToggleGroup from "@/app/components/ui/toggle/ToggleGroup";
import Pagination from "@/app/components/ui/pagination/Pagination";
import EmptyState from "@/app/components/ui/empty-state/EmptyState";

type SortType = "latest" | "oldest";

interface Props {
    pageSize?: number;
}

export default function SessionList({ pageSize = 5 }: Props) {
    const router = useRouter();
    const { sessions, loading } = useSessions();

    const [searchQuery, setSearchQuery] = useState("");
    const [sortBy, setSortBy] = useState<SortType>("latest");
    const [page, setPage] = useState(0);


    const filteredSessions = useMemo(() => {
        let result = [...sessions];

        if (searchQuery) {
            result = result.filter((s) =>
                s.sessionTitle.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        return result.sort((a, b) => {
            const timeA = new Date(a.moddate || a.regdate).getTime();
            const timeB = new Date(b.moddate || b.regdate).getTime();

            // 최신순 = 최신이 위
            // 과거순 = 오래된 게 위
            return sortBy === "latest"
                ? timeB - timeA
                : timeA - timeB;
        });
    }, [sessions, searchQuery, sortBy]);

    /* 페이지네이션 */
    const totalPages = Math.ceil(filteredSessions.length / pageSize);
    const pagedSessions = filteredSessions.slice(
        page * pageSize,
        (page + 1) * pageSize
    );

    /* 검색 / 정렬 바뀌면 첫 페이지 */
    useEffect(() => {
        setPage(0);
    }, [searchQuery, sortBy]);

    if (loading) {
        return (
            <Card padding="md">
                <div className="flex justify-center py-10">
                    <div className="h-6 w-6 animate-spin rounded-full border-2 border-accent border-t-transparent" />
                </div>
            </Card>
        );
    }

    return (
        <div className="space-y-4">
            {/* 검색 + 정렬 */}
            <div className="flex flex-col sm:flex-row gap-3 sm:items-center justify-between">
                <SearchInput
                    value={searchQuery}
                    onChange={setSearchQuery}
                    placeholder="세션 제목 검색..."
                    className="sm:w-80"
                />

                <ToggleGroup
                    value={sortBy}
                    onChange={(v) => setSortBy(v as SortType)}
                    size="sm"
                    options={[
                        { value: "latest", label: "최신순", icon: <SortDesc size={14} /> },
                        { value: "oldest", label: "과거순", icon: <SortAsc size={14} /> },
                    ]}
                />
            </div>

            {/* 리스트 */}
            {pagedSessions.length === 0 ? (
                <Card padding="lg">
                    <EmptyState
                        icon={<Folder className="w-10 h-10" />}
                        title="세션이 없습니다"
                        description="새 세션을 만들어 시작해보세요"
                    />
                </Card>
            ) : (
                <>
                    <Card padding="none" className="overflow-hidden">
                        <table className="w-full text-left">
                            <thead className="border-b bg-surface-light dark:bg-surface-dark">
                            <tr>
                                <th className="px-5 py-3 text-xs text-text-muted-light">
                                    세션 정보
                                </th>
                                <th className="hidden md:table-cell px-5 py-3 text-xs text-text-muted-light">
                                    생성일
                                </th>
                                <th className="px-5 py-3 text-xs text-text-muted-light">
                                    최종 수정
                                </th>
                            </tr>
                            </thead>
                            <tbody className="divide-y">
                            {pagedSessions.map((session) => (
                                <tr
                                    key={session.sessionId}
                                    className="hover:bg-surface-light dark:hover:bg-surface-dark cursor-pointer"
                                    onClick={() =>
                                        router.push(`/workspace/${session.sessionId}`)
                                    }
                                >
                                    <td className="px-5 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-accent-soft flex items-center justify-center">
                                                <FolderOpen className="w-5 h-5 text-accent" />
                                            </div>
                                            <div className="min-w-0">
                                                <p className="text-sm font-bold truncate">
                                                    {session.sessionTitle}
                                                </p>
                                                <p className="text-xs text-text-muted-light truncate">
                                                    {session.description || "설명 없음"}
                                                </p>
                                            </div>
                                        </div>
                                    </td>

                                    <td className="hidden md:table-cell px-5 py-4 text-xs text-text-muted-light">
                                        <Calendar className="inline w-3 h-3 mr-1" />
                                        {new Date(session.regdate).toLocaleDateString("ko-KR")}
                                    </td>

                                    <td className="px-5 py-4 text-xs text-text-muted-light">
                                        <Clock className="inline w-3 h-3 mr-1" />
                                        {new Date(
                                            session.moddate || session.regdate
                                        ).toLocaleDateString("ko-KR")}
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </Card>

                    {/* 페이지네이션 */}
                    {totalPages > 1 && (
                        <div className="flex justify-center pt-4">
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
                </>
            )}
        </div>
    );
}
