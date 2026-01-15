"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
    Folder,
    Plus,
    Clock,
    Calendar,
    MoreVertical,
    FolderOpen,
    SortAsc,
    SortDesc
} from "lucide-react";

import { useSessions } from "@/hooks/sessions/useSessions";
import Card from "@/app/components/ui/card/Card";
import Button from "@/app/components/ui/button/Button";
import EmptyState from "@/app/components/ui/empty-state/EmptyState";
import ToggleGroup from "@/app/components/ui/toggle/ToggleGroup";
import Pagination from "@/app/components/ui/pagination/Pagination";
import SearchInput from "@/app/components/ui/input/SearchInput";

interface SessionListProps {
    /** 페이지당 표시할 세션 수 */
    pageSize?: number;
    /** 컴팩트 모드 (네비용) */
    compact?: boolean;
    /** 새 세션 생성 버튼 표시 여부 */
    showCreateButton?: boolean;
}

export default function SessionList({
                                        pageSize = 5,
                                        compact = false,
                                        showCreateButton = true,
                                    }: SessionListProps) {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState("");
    const [sortBy, setSortBy] = useState<"latest" | "oldest">("latest");
    const [page, setPage] = useState(0);

    const { sessions, loading } = useSessions();

    const filteredSessions = useMemo(() => {
        let result = sessions;

        if (searchQuery) {
            result = result.filter(s =>
                s.sessionTitle.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        return result.sort((a, b) => {
            if (sortBy === "latest") {
                return new Date(b.moddate || b.regdate).getTime() - new Date(a.moddate || a.regdate).getTime();
            }
            return new Date(a.moddate || a.regdate).getTime() - new Date(b.moddate || b.regdate).getTime();
        });
    }, [sessions, searchQuery, sortBy]);

    // 페이지네이션
    const totalPages = Math.ceil(filteredSessions.length / pageSize);
    const paginatedSessions = filteredSessions.slice(
        page * pageSize,
        (page + 1) * pageSize
    );

    // 검색어나 정렬이 바뀌면 첫 페이지로
    useMemo(() => {
        setPage(0);
    }, [searchQuery, sortBy]);

    if (loading) {
        return (
            <Card variant="default" padding="md">
                <div className="flex items-center justify-center py-8">
                    <div className="h-6 w-6 animate-spin rounded-full border-2 border-accent border-t-transparent" />
                </div>
            </Card>
        );
    }

    return (
        <div className="space-y-4">
            {/* 헤더 */}
            <div className="flex items-center justify-between">
                <h2 className={`font-bold text-text-primary-light dark:text-text-primary-dark ${
                    compact ? 'text-base' : 'text-xl'
                }`}>
                    내 세션
                </h2>
                {!compact && showCreateButton && (
                    <Button onClick={() => router.push("/workspace")} size="sm" className="gap-2">
                        <Plus className="w-4 h-4" />
                        새 세션
                    </Button>
                )}
            </div>

            {/* 검색 & 정렬 */}
            <div className="flex items-center gap-2">
                <SearchInput
                    value={searchQuery}
                    onChange={setSearchQuery}
                    placeholder="세션 검색..."
                    className={compact ? "flex-1" : "w-64"}
                />
                <ToggleGroup
                    value={sortBy}
                    onChange={(v) => setSortBy(v as any)}
                    options={[
                        { value: "latest", label: "최신순", icon: <SortDesc className="w-3 h-3" /> },
                        { value: "oldest", label: "오래된순", icon: <SortAsc className="w-3 h-3" /> },
                    ]}
                    size="sm"
                />
            </div>

            {/* 세션 리스트 */}
            {filteredSessions.length === 0 ? (
                <Card variant="default" padding="lg">
                    <EmptyState
                        icon={<Folder className="w-10 h-10" />}
                        title={searchQuery ? "검색 결과가 없습니다" : "아직 세션이 없습니다"}
                        description={searchQuery ? "다른 검색어를 시도해보세요" : "새 세션을 만들어 프로젝트를 시작해보세요"}
                    />
                </Card>
            ) : compact ? (
                // 컴팩트 모드 (리스트 뷰)
                <Card variant="default" padding="none">
                    <div className="divide-y divide-border-light dark:divide-border-dark">
                        {paginatedSessions.map((session) => (
                            <div
                                key={session.sessionId}
                                className="flex items-center gap-3 p-3 hover:bg-surface-light dark:hover:bg-surface-dark cursor-pointer"
                                onClick={() => router.push(`/workspace/${session.sessionId}`)}
                            >
                                <div className="w-8 h-8 rounded-lg bg-accent-soft flex items-center justify-center flex-shrink-0">
                                    <FolderOpen className="w-4 h-4 text-accent" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-text-primary-light dark:text-text-primary-dark truncate">
                                        {session.sessionTitle}
                                    </p>
                                    <div className="flex items-center gap-2 text-xs text-text-muted-light dark:text-text-muted-dark">
                                        <Clock className="w-3 h-3" />
                                        {new Date(session.moddate || session.regdate).toLocaleDateString('ko-KR')}
                                    </div>
                                </div>
                                <button
                                    className="p-1 rounded hover:bg-surface-light dark:hover:bg-surface-dark"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <MoreVertical className="w-4 h-4 text-text-muted-light dark:text-text-muted-dark" />
                                </button>
                            </div>
                        ))}
                    </div>
                </Card>
            ) : (
                // 테이블 모드
                <Card variant="default" padding="none">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="border-b border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-text-muted-light dark:text-text-muted-dark">
                                    세션명
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-text-muted-light dark:text-text-muted-dark">
                                    상태
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-text-muted-light dark:text-text-muted-dark">
                                    생성일
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-text-muted-light dark:text-text-muted-dark">
                                    최종 수정
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-text-muted-light dark:text-text-muted-dark">
                                    액션
                                </th>
                            </tr>
                            </thead>
                            <tbody className="divide-y divide-border-light dark:divide-border-dark">
                            {paginatedSessions.map((session) => (
                                <tr
                                    key={session.sessionId}
                                    className="hover:bg-surface-light dark:hover:bg-surface-dark cursor-pointer"
                                    onClick={() => router.push(`/workspace/${session.sessionId}`)}
                                >
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-lg bg-accent-soft flex items-center justify-center flex-shrink-0">
                                                <FolderOpen className="w-5 h-5 text-accent" />
                                            </div>
                                            <div className="min-w-0">
                                                <p className="text-sm font-medium text-text-primary-light dark:text-text-primary-dark truncate">
                                                    {session.sessionTitle}
                                                </p>
                                                {session.description && (
                                                    <p className="text-xs text-text-muted-light dark:text-text-muted-dark truncate">
                                                        {session.description}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium ${
                                                session.status === 'ACTIVE'
                                                    ? 'bg-accent-soft text-accent'
                                                    : 'bg-surface-light dark:bg-surface-dark text-text-muted-light dark:text-text-muted-dark'
                                            }`}>
                                                {session.status}
                                            </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-1 text-sm text-text-muted-light dark:text-text-muted-dark">
                                            <Calendar className="w-3 h-3" />
                                            {new Date(session.regdate).toLocaleDateString('ko-KR')}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-1 text-sm text-text-muted-light dark:text-text-muted-dark">
                                            <Clock className="w-3 h-3" />
                                            {new Date(session.moddate || session.regdate).toLocaleDateString('ko-KR')}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button
                                            className="p-2 rounded-lg hover:bg-surface-light dark:hover:bg-surface-dark"
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            <MoreVertical className="w-4 h-4 text-text-muted-light dark:text-text-muted-dark" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </Card>
            )}

            {/* 페이지네이션 */}
            {totalPages > 1 && (
                <Pagination
                    pageNumber={page}
                    totalPages={totalPages}
                    hasNext={page < totalPages - 1}
                    hasPrevious={page > 0}
                    isFirst={page === 0}
                    isLast={page === totalPages - 1}
                    onChange={setPage}
                />
            )}
        </div>
    );
}