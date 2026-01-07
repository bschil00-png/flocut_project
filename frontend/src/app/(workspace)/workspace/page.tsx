"use client";

import Link from "next/link";
import {
    Folder,
    Plus,
    Clock,
    FileText,
    Loader2,
    File,
    TrendingUp,
    Sparkles,
    Upload,
    ChevronRight
} from "lucide-react";
import { useSessions } from "@/hooks/sessions/useSessions";
import { useSessionFiles } from "@/hooks/files/useSessionFiles";
import { useMemo, useState } from "react";
import CreateSessionModal from "@/app/components/sessions/CreateSessionModal";
import Card from "@/app/components/ui/card/Card";
import List from "@/app/components/ui/list/List";
import ListItem from "@/app/components/ui/list/ListItem";
import Button from "@/app/components/ui/button/Button";
import EmptyState from "@/app/components/ui/empty-state/EmptyState";
import {gql} from "@apollo/client";
import {useQuery} from "@apollo/client/react";

// GraphQL 쿼리: 최근 요약 내역 조회
const GET_RECENT_SUMMARIES = gql`
  query GetRecentSummaries {
    recentSummaries(limit: 5) {
      summaryId
      fileId
      summaryText
      status
      createdAt
      file {
        fileName
      }
    }
  }
`;

interface Summary {
    summaryId: number;
    fileId: number;
    summaryText: string;
    status: string;
    createdAt: string;
    file: { fileName: string };
}
interface SummariesData {
    recentSummaries: Summary[];
}

export default function WorkspacePage() {
    // 새 세션 모달 상태
    const [openCreate, setOpenCreate] = useState(false);

    const { sessions, loading, refetch } = useSessions();
    const { files } = useSessionFiles(
        sessions.length > 0 ? sessions[0].sessionId : 0
    );
    // 최근 요약 내역 조회
    const { data: summaryData, loading: summaryLoading } = useQuery<SummariesData>(GET_RECENT_SUMMARIES);

    const stats = useMemo(() => {
        return {
            totalSessions: sessions.length,
            totalDocuments: files.length,
            // 이제 summaryData에서 recentSummaries를 정상적으로 인식합니다.
            totalSummaries: summaryData?.recentSummaries?.length || 0,
            recentActivity: sessions.length > 0 ? sessions[0].regdate : null,
        };
    }, [sessions, files, summaryData]);

    // 최근 문서 5개 (날짜순 정렬)
    const recentFiles = useMemo(() => {
        return [...files]
            .sort((a, b) => new Date(b.regdate || 0).getTime() - new Date(a.regdate || 0).getTime())
            .slice(0, 5);
    }, [files]);

    // 최근 요약 5개
    const recentSummaries = useMemo(() => {
        return summaryData?.recentSummaries || [];
    }, [summaryData]);

    if (loading) {
        return (
            <div className="h-full flex items-center justify-center">
                <Loader2 className="animate-spin text-accent" size={32} />
            </div>
        );
    }

    return (
        <div className="h-full overflow-y-auto bg-background-light dark:bg-background-dark">
            <div className="max-w-7xl mx-auto px-6 sm:px-8 py-8 sm:py-12">

                {/* 헤더 */}
                <div className="mb-8">
                    <h1 className="text-3xl sm:text-4xl font-bold text-text-primary-light dark:text-text-primary-dark mb-2">
                        워크스페이스
                    </h1>
                    <p className="text-text-muted-light dark:text-text-muted-dark">
                        모든 세션과 문서를 한 곳에서 관리하세요
                    </p>
                </div>

                {/* 통계 위젯 */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    {/* 활성 세션 */}
                    <Card variant="default" padding="md">
                        <div className="flex items-center justify-between mb-3">
                            <Folder size={20} className="text-accent" />
                            <TrendingUp size={14} className="text-text-muted-light dark:text-text-muted-dark" />
                        </div>
                        <div className="text-2xl font-bold text-text-primary-light dark:text-text-primary-dark mb-1">
                            {stats.totalSessions}
                        </div>
                        <div className="text-sm text-text-muted-light dark:text-text-muted-dark">
                            활성 세션
                        </div>
                    </Card>

                    {/* 업로드 문서 */}
                    <Card variant="default" padding="md">
                        <div className="flex items-center justify-between mb-3">
                            <File size={20} className="text-accent" />
                        </div>
                        <div className="text-2xl font-bold text-text-primary-light dark:text-text-primary-dark mb-1">
                            {stats.totalDocuments}
                        </div>
                        <div className="text-sm text-text-muted-light dark:text-text-muted-dark">
                            업로드 문서
                        </div>
                    </Card>

                    {/* AI 요약 */}
                    <Card variant="default" padding="md">
                        <div className="flex items-center justify-between mb-3">
                            <Sparkles size={20} className="text-accent" />
                        </div>
                        <div className="text-2xl font-bold text-text-primary-light dark:text-text-primary-dark mb-1">
                            {stats.totalSummaries}
                        </div>
                        <div className="text-sm text-text-muted-light dark:text-text-muted-dark">
                            AI 요약
                        </div>
                    </Card>

                    {/* 최근 활동 */}
                    <Card variant="default" padding="md">
                        <div className="flex items-center justify-between mb-3">
                            <Clock size={20} className="text-accent" />
                        </div>
                        <div className="text-lg font-semibold text-text-primary-light dark:text-text-primary-dark mb-1">
                            {stats.recentActivity
                                ? new Date(stats.recentActivity).toLocaleDateString("ko-KR", {
                                    month: "short",
                                    day: "numeric"
                                })
                                : "활동 없음"
                            }
                        </div>
                        <div className="text-sm text-text-muted-light dark:text-text-muted-dark">
                            최근 활동
                        </div>
                    </Card>
                </div>

                {/* 3단 레이아웃: 빠른 액세스 + 최근 문서 + 최근 AI 요약 */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">

                    {/* 빠른 액세스 */}
                    <Card variant="default" padding="md">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-semibold text-text-primary-light dark:text-text-primary-dark">
                                빠른 액세스
                            </h2>
                        </div>

                        <div className="space-y-2">
                            {/* 새 세션 */}
                            <button
                                onClick={() => setOpenCreate(true)}
                                className="w-full flex items-center gap-3 p-3 rounded-lg border border-border-light dark:border-border-dark hover:bg-accent-soft transition-colors text-left"
                            >
                                <div className="w-10 h-10 rounded-lg bg-accent-soft flex items-center justify-center flex-shrink-0">
                                    <Plus size={20} className="text-accent" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-medium text-text-primary-light dark:text-text-primary-dark text-sm">
                                        새 세션
                                    </h3>
                                    <p className="text-xs text-text-muted-light dark:text-text-muted-dark">
                                        프로젝트 시작
                                    </p>
                                </div>
                                <ChevronRight size={16} className="text-text-muted-light dark:text-text-muted-dark flex-shrink-0" />
                            </button>

                            {/* 문서 업로드 */}
                            <Link
                                href={sessions.length > 0 ? `/workspace/${sessions[0].sessionId}` : "/workspace"}
                                className="w-full flex items-center gap-3 p-3 rounded-lg border border-border-light dark:border-border-dark hover:bg-accent-soft transition-colors"
                            >
                                <div className="w-10 h-10 rounded-lg bg-accent-soft flex items-center justify-center flex-shrink-0">
                                    <Upload size={20} className="text-accent" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-medium text-text-primary-light dark:text-text-primary-dark text-sm">
                                        문서 업로드
                                    </h3>
                                    <p className="text-xs text-text-muted-light dark:text-text-muted-dark">
                                        PDF/DOCX 분석
                                    </p>
                                </div>
                                <ChevronRight size={16} className="text-text-muted-light dark:text-text-muted-dark flex-shrink-0" />
                            </Link>

                            {/* AI 요약 */}
                            <Link
                                href={sessions.length > 0 ? `/workspace/${sessions[0].sessionId}` : "/workspace"}
                                className="w-full flex items-center gap-3 p-3 rounded-lg border border-border-light dark:border-border-dark hover:bg-accent-soft transition-colors"
                            >
                                <div className="w-10 h-10 rounded-lg bg-accent-soft flex items-center justify-center flex-shrink-0">
                                    <Sparkles size={20} className="text-accent" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-medium text-text-primary-light dark:text-text-primary-dark text-sm">
                                        AI 요약
                                    </h3>
                                    <p className="text-xs text-text-muted-light dark:text-text-muted-dark">
                                        문서 분석
                                    </p>
                                </div>
                                <ChevronRight size={16} className="text-text-muted-light dark:text-text-muted-dark flex-shrink-0" />
                            </Link>

                            {/* 새 노트 */}
                            <Link
                                href={sessions.length > 0 ? `/workspace/${sessions[0].sessionId}?type=note&id=new` : "/workspace"}
                                className="w-full flex items-center gap-3 p-3 rounded-lg border border-border-light dark:border-border-dark hover:bg-accent-soft transition-colors"
                            >
                                <div className="w-10 h-10 rounded-lg bg-accent-soft flex items-center justify-center flex-shrink-0">
                                    <FileText size={20} className="text-accent" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-medium text-text-primary-light dark:text-text-primary-dark text-sm">
                                        새 노트
                                    </h3>
                                    <p className="text-xs text-text-muted-light dark:text-text-muted-dark">
                                        빈 노트 작성
                                    </p>
                                </div>
                                <ChevronRight size={16} className="text-text-muted-light dark:text-text-muted-dark flex-shrink-0" />
                            </Link>
                        </div>
                    </Card>

                    {/* 최근 문서 */}
                    <Card variant="default" padding="md">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-semibold text-text-primary-light dark:text-text-primary-dark">
                                최근 문서
                            </h2>
                            {files.length > 0 && (
                                <Link
                                    href="/recent"
                                    className="text-sm text-accent hover:underline"
                                >
                                    전체보기
                                </Link>
                            )}
                        </div>

                        {recentFiles.length === 0 ? (
                            <EmptyState
                                icon={<File size={40} />}
                                title="최근 문서가 없습니다"
                                description="문서를 업로드하면 여기에 표시됩니다"
                            />
                        ) : (
                            <List>
                                {recentFiles.map((file) => (
                                    <ListItem
                                        key={file.fileId}
                                        title={file.fileName}
                                        description={`업로드: ${new Date(file.regdate || "").toLocaleDateString("ko-KR")}`}
                                        icon={<File size={16} />}
                                        meta={
                                            new Date(file.regdate || "").toLocaleDateString("ko-KR", {
                                                month: "short",
                                                day: "numeric"
                                            })
                                        }
                                        onClick={() => {
                                            if (sessions.length > 0) {
                                                window.location.href = `/workspace/${sessions[0].sessionId}?type=document&id=${file.fileId}`;
                                            }
                                        }}
                                    />
                                ))}
                            </List>
                        )}
                    </Card>

                    {/* 최근 AI 요약 */}
                    <Card variant="default" padding="md">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-semibold text-text-primary-light dark:text-text-primary-dark">
                                최근 AI 요약
                            </h2>
                            {recentSummaries.length > 0 && (
                                <Link
                                    href="/summaries"
                                    className="text-sm text-accent hover:underline"
                                >
                                    전체보기
                                </Link>
                            )}
                        </div>

                        {summaryLoading ? (
                            <div className="flex items-center justify-center py-8">
                                <Loader2 className="animate-spin text-accent" size={24} />
                            </div>
                        ) : recentSummaries.length === 0 ? (
                            <EmptyState
                                icon={<Sparkles size={40} />}
                                title="최근 요약이 없습니다"
                                description="AI 요약을 실행하면 여기에 표시됩니다"
                            />
                        ) : (
                            <List>
                                {recentSummaries.map((summary: any) => (
                                    <ListItem
                                        key={summary.summaryId}
                                        title={summary.file?.fileName || "제목 없음"}
                                        description={
                                            summary.summaryText
                                                ? summary.summaryText.slice(0, 60) + "..."
                                                : "요약 중..."
                                        }
                                        icon={<Sparkles size={16} />}
                                        meta={
                                            new Date(summary.createdAt).toLocaleDateString("ko-KR", {
                                                month: "short",
                                                day: "numeric"
                                            })
                                        }
                                        onClick={() => {
                                            if (sessions.length > 0) {
                                                window.location.href = `/workspace/${sessions[0].sessionId}?type=document&id=${summary.fileId}`;
                                            }
                                        }}
                                    />
                                ))}
                            </List>
                        )}
                    </Card>
                </div>

                {/* 내 세션 목록 */}
                <div>
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl sm:text-2xl font-bold text-text-primary-light dark:text-text-primary-dark">
                            내 세션
                        </h2>
                        <span className="text-sm text-text-muted-light dark:text-text-muted-dark">
              {sessions.length}개
            </span>
                    </div>

                    {sessions.length === 0 ? (
                        <Card variant="default" padding="lg">
                            <EmptyState
                                icon={<Folder size={48} />}
                                title="아직 세션이 없습니다"
                                description="새 세션을 만들어 프로젝트를 시작해보세요"
                                action={
                                    <Button
                                        variant="primary"
                                        onClick={() => setOpenCreate(true)}
                                    >
                                        <Plus size={18} />
                                        새 세션 만들기
                                    </Button>
                                }
                            />
                        </Card>
                    ) : (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                            {sessions.map((session) => (
                                <SessionCard
                                    key={session.sessionId}
                                    session={session}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* 새 세션 모달 */}
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

// 세션 카드 컴포넌트
function SessionCard({ session }: { session: any }) {
    return (
        <Link
            href={`/workspace/${session.sessionId}`}
            className="group block p-5 rounded-xl border border-border-light dark:border-border-dark hover:border-accent hover:shadow-md transition-all bg-white dark:bg-surface-dark"
        >
            <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-accent-soft flex items-center justify-center">
                    <Folder size={24} className="text-accent" />
                </div>

                <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-text-primary-light dark:text-text-primary-dark mb-1 truncate">
                        {session.sessionTitle}
                    </h3>

                    {session.description && (
                        <p className="text-sm text-text-muted-light dark:text-text-muted-dark line-clamp-2 mb-2">
                            {session.description}
                        </p>
                    )}

                    <div className="flex items-center gap-3 text-xs text-text-muted-light dark:text-text-muted-dark">
            <span className="flex items-center gap-1">
              <Clock size={12} />
                {new Date(session.regdate).toLocaleDateString("ko-KR", {
                    year: "numeric",
                    month: "short",
                    day: "numeric"
                })}
            </span>
                    </div>
                </div>

                <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="px-3 py-1.5 rounded-md bg-accent text-white text-sm font-medium">
                        열기
                    </div>
                </div>
            </div>
        </Link>
    );
}