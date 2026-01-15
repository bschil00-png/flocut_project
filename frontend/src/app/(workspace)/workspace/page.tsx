"use client";

import Link from "next/link";
import {
    Folder,
    Plus,
    Clock,
    FileText,
    Loader2,
    File,
    ChevronRight,
    Calendar,
    MoreVertical,
    FolderOpen,
    TrendingUp,
    SortAsc,
    SortDesc,
    Activity
} from "lucide-react";

import { useSessions } from "@/hooks/sessions/useSessions";
import { useSessionFiles } from "@/hooks/files/useSessionFiles";
import { useMemo, useState } from "react";
import { gql } from "@apollo/client";
import { useQuery } from "@apollo/client/react";
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

import CreateSessionModal from "@/app/components/sessions/CreateSessionModal";
import Card from "@/app/components/ui/card/Card";
import Button from "@/app/components/ui/button/Button";
import EmptyState from "@/app/components/ui/empty-state/EmptyState";
import SearchInput from "@/app/components/ui/input/SearchInput";
import ToggleGroup from "@/app/components/ui/toggle/ToggleGroup";
import Pagination from "@/app/components/ui/pagination/Pagination";

const NOTES_QUERY = gql`
  query AllNotes {
    allNotes: notesByStatus(status: ACTIVE, page: { page: 0, size: 100 }) {
      content {
        noteId
        sessionId
        title
        regdate
        moddate
      }
    }
  }
`;

interface Note {
    noteId: number;
    sessionId: number;
    title: string;
    regdate: string;
    moddate?: string;
}

interface NotesData {
    allNotes: {
        content: Note[];
    };
}

export default function WorkspacePage() {
    const [openCreate, setOpenCreate] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [sortBy, setSortBy] = useState<"latest" | "oldest">("latest");
    const [sessionPage, setSessionPage] = useState(0);

    const { sessions, loading, refetch } = useSessions();
    const { files } = useSessionFiles(
        sessions.length > 0 ? sessions[0].sessionId : 0
    );
    const { data: notesData } = useQuery<NotesData>(NOTES_QUERY);

    const notes = useMemo(() => {
        return notesData?.allNotes?.content || [];
    }, [notesData]);

    // 최근 7일 활동 데이터
    const activityData = useMemo(() => {
        const last7Days = [];
        for (let i = 6; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            const dateStr = date.toISOString().split('T')[0];

            const sessionsCount = sessions.filter(s =>
                new Date(s.regdate).toISOString().split('T')[0] === dateStr
            ).length;

            const filesCount = files.filter(f =>
                new Date(f.regdate || "").toISOString().split('T')[0] === dateStr
            ).length;

            last7Days.push({
                date: date.toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' }),
                세션: sessionsCount,
                문서: filesCount,
            });
        }
        return last7Days;
    }, [sessions, files]);

    const stats = useMemo(() => {
        return {
            totalSessions: sessions.length,
            activeSessions: sessions.filter(s => s.status === "ACTIVE").length,
            totalFiles: files.length,
            totalNotes: notes.length,
        };
    }, [sessions, files, notes]);

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

    // 세션 페이지네이션
    const pageSize = 5;
    const totalPages = Math.ceil(filteredSessions.length / pageSize);
    const paginatedSessions = filteredSessions.slice(
        sessionPage * pageSize,
        (sessionPage + 1) * pageSize
    );

    const recentFiles = useMemo(() => {
        return [...files]
            .sort((a, b) => new Date(b.regdate || 0).getTime() - new Date(a.regdate || 0).getTime())
            .slice(0, 8);
    }, [files]);

    const recentNotes = useMemo(() => {
        return [...notes]
            .sort((a, b) => new Date(b.moddate || b.regdate).getTime() - new Date(a.moddate || a.regdate).getTime())
            .slice(0, 8);
    }, [notes]);

    if (loading) {
        return (
            <div className="h-full flex items-center justify-center">
                <Loader2 className="animate-spin text-accent" size={32} />
            </div>
        );
    }

    return (
        <div className="h-full overflow-y-auto bg-background-light dark:bg-background-dark">
            <div className="max-w-[1400px] mx-auto px-6 lg:px-8 py-6 lg:py-8">
                {/* 헤더 */}
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h1 className="text-3xl font-bold text-text-primary-light dark:text-text-primary-dark mb-2">
                                대시보드
                            </h1>
                            <p className="text-sm text-text-muted-light dark:text-text-muted-dark">
                                {new Date().toLocaleDateString('ko-KR', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                    weekday: 'long'
                                })}
                            </p>
                        </div>
                        <Button onClick={() => setOpenCreate(true)} className="gap-2">
                            <Plus className="w-4 h-4" />
                            새 세션
                        </Button>
                    </div>

                    {/* 통계 카드 */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        <Card variant="default" padding="md">
                            <div className="flex items-start justify-between mb-3">
                                <div className="p-2 rounded-lg bg-accent-soft">
                                    <Folder className="w-5 h-5 text-accent" />
                                </div>
                                <div className="text-xs text-accent flex items-center gap-1">
                                    <TrendingUp className="w-3 h-3" />
                                    {stats.activeSessions}
                                </div>
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-text-primary-light dark:text-text-primary-dark mb-1">
                                    {stats.totalSessions}
                                </p>
                                <p className="text-xs text-text-muted-light dark:text-text-muted-dark">
                                    전체 세션
                                </p>
                            </div>
                        </Card>

                        <Card variant="default" padding="md">
                            <div className="flex items-start justify-between mb-3">
                                <div className="p-2 rounded-lg bg-surface-light dark:bg-surface-dark">
                                    <File className="w-5 h-5 text-accent" />
                                </div>
                                <div className="text-xs text-text-muted-light dark:text-text-muted-dark">
                                    {(stats.totalFiles * 2.5).toFixed(1)}MB
                                </div>
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-text-primary-light dark:text-text-primary-dark mb-1">
                                    {stats.totalFiles}
                                </p>
                                <p className="text-xs text-text-muted-light dark:text-text-muted-dark">
                                    업로드 문서
                                </p>
                            </div>
                        </Card>

                        <Card variant="default" padding="md">
                            <div className="flex items-start justify-between mb-3">
                                <div className="p-2 rounded-lg bg-accent-soft">
                                    <FileText className="w-5 h-5 text-accent" />
                                </div>
                                <div className="text-xs text-text-muted-light dark:text-text-muted-dark">
                                    최근
                                </div>
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-text-primary-light dark:text-text-primary-dark mb-1">
                                    {stats.totalNotes}
                                </p>
                                <p className="text-xs text-text-muted-light dark:text-text-muted-dark">
                                    작성한 노트
                                </p>
                            </div>
                        </Card>

                        <Card variant="default" padding="md">
                            <div className="flex items-start justify-between mb-3">
                                <div className="p-2 rounded-lg bg-surface-light dark:bg-surface-dark">
                                    <Activity className="w-5 h-5 text-accent" />
                                </div>
                                <div className="text-xs text-text-muted-light dark:text-text-muted-dark">
                                    Today
                                </div>
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-text-primary-light dark:text-text-primary-dark mb-1">
                                    {activityData[activityData.length - 1]?.세션 + activityData[activityData.length - 1]?.문서 || 0}
                                </p>
                                <p className="text-xs text-text-muted-light dark:text-text-muted-dark">
                                    오늘 활동
                                </p>
                            </div>
                        </Card>
                    </div>
                </div>

                {/* 차트 & 최근 문서/노트 */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                    {/* 주간 활동 차트 */}
                    <Card variant="default" padding="md" className="lg:col-span-2">
                        <div className="mb-6">
                            <h3 className="text-lg font-semibold text-text-primary-light dark:text-text-primary-dark mb-1">
                                주간 활동
                            </h3>
                            <p className="text-xs text-text-muted-light dark:text-text-muted-dark">
                                최근 7일간 생성 현황
                            </p>
                        </div>

                        <ResponsiveContainer width="100%" height={240}>
                            <AreaChart data={activityData}>
                                <defs>
                                    <linearGradient id="colorSession" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="var(--accent)" stopOpacity={0.3}/>
                                        <stop offset="95%" stopColor="var(--accent)" stopOpacity={0}/>
                                    </linearGradient>
                                    <linearGradient id="colorFile" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="var(--accent)" stopOpacity={0.15}/>
                                        <stop offset="95%" stopColor="var(--accent)" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" className="stroke-border-light dark:stroke-border-dark" opacity={0.2} />
                                <XAxis dataKey="date" className="text-text-muted-light dark:text-text-muted-dark" fontSize={11} />
                                <YAxis className="text-text-muted-light dark:text-text-muted-dark" fontSize={11} />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: 'var(--background-light)',
                                        border: '1px solid var(--border-light)',
                                        borderRadius: '8px',
                                        fontSize: '12px'
                                    }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="세션"
                                    stroke="var(--accent)"
                                    fillOpacity={1}
                                    fill="url(#colorSession)"
                                    strokeWidth={2}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="문서"
                                    stroke="var(--accent)"
                                    fillOpacity={1}
                                    fill="url(#colorFile)"
                                    strokeWidth={2}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </Card>

                    {/* 최근 문서 */}
                    <Card variant="default" padding="md">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-base font-semibold text-text-primary-light dark:text-text-primary-dark">
                                최근 문서
                            </h3>
                        </div>

                        {recentFiles.length === 0 ? (
                            <div className="py-12 text-center">
                                <File className="w-10 h-10 mx-auto mb-2 text-text-muted-light dark:text-text-muted-dark opacity-50" />
                                <p className="text-sm text-text-muted-light dark:text-text-muted-dark">
                                    최근 문서가 없습니다
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-2 max-h-[220px] overflow-y-auto">
                                {recentFiles.slice(0, 5).map((file) => (
                                    <div
                                        key={file.fileId}
                                        className="flex items-center gap-3 p-2 rounded-lg hover:bg-surface-light dark:hover:bg-surface-dark cursor-pointer"
                                        onClick={() => {
                                            if (sessions.length > 0) {
                                                window.location.href = `/workspace/${sessions[0].sessionId}?type=document&id=${file.fileId}`;
                                            }
                                        }}
                                    >
                                        <div className="w-8 h-8 rounded-lg bg-accent-soft flex items-center justify-center flex-shrink-0">
                                            <File className="w-4 h-4 text-accent" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-text-primary-light dark:text-text-primary-dark truncate">
                                                {file.fileName}
                                            </p>
                                            <div className="flex items-center gap-1 text-xs text-text-muted-light dark:text-text-muted-dark">
                                                <Clock className="w-3 h-3" />
                                                {new Date(file.regdate || "").toLocaleDateString('ko-KR')}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </Card>
                </div>

                {/* 최근 노트 */}
                <Card variant="default" padding="md" className="mb-8">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-text-primary-light dark:text-text-primary-dark">
                            최근 노트
                        </h3>
                    </div>

                    {recentNotes.length === 0 ? (
                        <div className="py-12 text-center">
                            <FileText className="w-10 h-10 mx-auto mb-2 text-text-muted-light dark:text-text-muted-dark opacity-50" />
                            <p className="text-sm text-text-muted-light dark:text-text-muted-dark">
                                최근 노트가 없습니다
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            {recentNotes.map((note) => (
                                <div
                                    key={note.noteId}
                                    className="p-4 rounded-lg border border-border-light dark:border-border-dark hover:border-accent cursor-pointer"
                                    onClick={() => {
                                        window.location.href = `/workspace/${note.sessionId}?type=note&id=${note.noteId}`;
                                    }}
                                >
                                    <div className="w-10 h-10 rounded-lg bg-surface-light dark:bg-surface-dark flex items-center justify-center mb-3">
                                        <FileText className="w-5 h-5 text-accent" />
                                    </div>
                                    <p className="text-sm font-medium text-text-primary-light dark:text-text-primary-dark truncate mb-1">
                                        {note.title}
                                    </p>
                                    <div className="flex items-center gap-1 text-xs text-text-muted-light dark:text-text-muted-dark">
                                        <Clock className="w-3 h-3" />
                                        {new Date(note.moddate || note.regdate).toLocaleDateString('ko-KR')}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </Card>

                {/* 세션 목록 */}
                <div>
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-bold text-text-primary-light dark:text-text-primary-dark">
                            내 세션
                        </h2>
                        <div className="flex items-center gap-2">
                            <SearchInput
                                value={searchQuery}
                                onChange={setSearchQuery}
                                placeholder="세션 검색..."
                                className="w-64"
                            />
                            <ToggleGroup
                                value={sortBy}
                                onChange={(v) => setSortBy(v as any)}
                                options={[
                                    { value: "latest", label: "최신순", icon: <SortDesc className="w-4 h-4" /> },
                                    { value: "oldest", label: "오래된순", icon: <SortAsc className="w-4 h-4" /> },
                                ]}
                                size="sm"
                            />
                        </div>
                    </div>

                    {filteredSessions.length === 0 ? (
                        <Card variant="default" padding="lg">
                            <EmptyState
                                icon={<Folder className="w-12 h-12" />}
                                title={searchQuery ? "검색 결과가 없습니다" : "아직 세션이 없습니다"}
                                description={searchQuery ? "다른 검색어를 시도해보세요" : "새 세션을 만들어 프로젝트를 시작해보세요"}
                                action={
                                    !searchQuery && (
                                        <Button onClick={() => setOpenCreate(true)} className="gap-2">
                                            <Plus className="w-4 h-4" />
                                            새 세션 만들기
                                        </Button>
                                    )
                                }
                            />
                        </Card>
                    ) : (
                        <>
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
                                                onClick={() => window.location.href = `/workspace/${session.sessionId}`}
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

                            {/* 페이지네이션 */}
                            {totalPages > 1 && (
                                <div className="mt-4">
                                    <Pagination
                                        pageNumber={sessionPage}
                                        totalPages={totalPages}
                                        hasNext={sessionPage < totalPages - 1}
                                        hasPrevious={sessionPage > 0}
                                        isFirst={sessionPage === 0}
                                        isLast={sessionPage === totalPages - 1}
                                        onChange={setSessionPage}
                                    />
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>

            <CreateSessionModal
                open={openCreate}
                onClose={() => {
                    setOpenCreate(false);
                    refetch();
                }}
            />
        </div>
    );
}