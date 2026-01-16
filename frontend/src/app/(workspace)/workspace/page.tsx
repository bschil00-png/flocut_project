"use client";

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
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

import CreateSessionModal from "@/app/components/sessions/CreateSessionModal";
import Card from "@/app/components/ui/card/Card";
import Button from "@/app/components/ui/button/Button";
import EmptyState from "@/app/components/ui/empty-state/EmptyState";
import SearchInput from "@/app/components/ui/input/SearchInput";
import ToggleGroup from "@/app/components/ui/toggle/ToggleGroup";
import Pagination from "@/app/components/ui/pagination/Pagination";

export default function WorkspacePage() {
  const [openCreate, setOpenCreate] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"latest" | "oldest">("latest");
  const [sessionPage, setSessionPage] = useState(0);

  const { sessions, loading, refetch } = useSessions();

  // 첫 번째 세션의 파일을 대표로 가져옴 (통계용)
  const { files } = useSessionFiles(
    sessions.length > 0 ? sessions[0].sessionId : 0
  );

  // 최근 7일 활동 데이터 계산
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
      totalFiles: files.length,
    };
  }, [sessions, files]);

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

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <Loader2 className="animate-spin text-accent" size={32} />
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto bg-background-light dark:bg-background-dark custom-scrollbar">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        {/* 헤더 섹션 */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-text-primary-light dark:text-text-primary-dark mb-1">
                워크스페이스
              </h1>
              <p className="text-xs sm:text-sm text-text-muted-light dark:text-text-muted-dark font-medium">
                {new Date().toLocaleDateString('ko-KR', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  weekday: 'long'
                })}
              </p>
            </div>

          </div>

          {/* 통계 카드 그리드 */}
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
            <Card variant="default" padding="md" className="border-none shadow-sm">
              <div className="flex items-start justify-between mb-2">
                <div className="p-2 rounded-lg bg-accent-soft">
                  <Folder className="w-5 h-5 text-accent" />
                </div>
              </div>
              <div>
                <p className="text-xl sm:text-2xl font-bold text-text-primary-light dark:text-text-primary-dark">
                  {stats.totalSessions}
                </p>
                <p className="text-[11px] sm:text-xs text-text-muted-light dark:text-text-muted-dark font-medium">
                  전체 세션
                </p>
              </div>
            </Card>

            <Card variant="default" padding="md" className="border-none shadow-sm">
              <div className="flex items-start justify-between mb-2">
                <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-900/20">
                  <File className="w-5 h-5 text-blue-500" />
                </div>
              </div>
              <div>
                <p className="text-xl sm:text-2xl font-bold text-text-primary-light dark:text-text-primary-dark">
                  {stats.totalFiles}
                </p>
                <p className="text-[11px] sm:text-xs text-text-muted-light dark:text-text-muted-dark font-medium">
                  업로드 문서
                </p>
              </div>
            </Card>

            <Card variant="default" padding="md" className="border-none shadow-sm col-span-2 lg:col-span-1">
              <div className="flex items-start justify-between mb-2">
                <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-900/20">
                  <Activity className="w-5 h-5 text-emerald-500" />
                </div>
              </div>
              <div>
                <p className="text-xl sm:text-2xl font-bold text-text-primary-light dark:text-text-primary-dark">
                  {activityData[activityData.length - 1]?.세션 + activityData[activityData.length - 1]?.문서 || 0}
                </p>
                <p className="text-[11px] sm:text-xs text-text-muted-light dark:text-text-muted-dark font-medium">
                  오늘의 활동
                </p>
              </div>
            </Card>
          </div>
        </div>

        {/* 차트 & 최근 문서 그리드 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
          <Card variant="default" padding="md" className="lg:col-span-2 border-none shadow-sm">
            <div className="mb-6">
              <h3 className="text-base sm:text-lg font-bold text-text-primary-light dark:text-text-primary-dark">
                주간 활동 트렌드
              </h3>
            </div>

            <div className="w-full h-[240px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={activityData}>
                  <defs>
                    <linearGradient id="colorSession" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--accent)" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="var(--accent)" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-light)" opacity={0.5} />
                  <XAxis dataKey="date" axisLine={false} tickLine={false} fontSize={11} tick={{fill: 'var(--text-muted-light)'}} />
                  <YAxis axisLine={false} tickLine={false} fontSize={11} tick={{fill: 'var(--text-muted-light)'}} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'var(--background-light)',
                      border: 'none',
                      borderRadius: '12px',
                      boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
                      fontSize: '12px'
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="세션"
                    stroke="var(--accent)"
                    fill="url(#colorSession)"
                    strokeWidth={3}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card variant="default" padding="md" className="border-none shadow-sm overflow-hidden">
            <h3 className="text-base font-bold text-text-primary-light dark:text-text-primary-dark mb-4">
              최근 업로드
            </h3>

            {recentFiles.length === 0 ? (
              <div className="py-20 text-center">
                <File className="w-10 h-10 mx-auto mb-2 text-text-muted-light opacity-30" />
                <p className="text-xs text-text-muted-light">문서가 없습니다</p>
              </div>
            ) : (
              <div className="space-y-1">
                {recentFiles.slice(0, 6).map((file) => (
                  <div
                    key={file.fileId}
                    className="flex items-center gap-3 p-2 rounded-xl hover:bg-surface-light dark:hover:bg-surface-dark cursor-pointer transition-colors group"
                    onClick={() => {
                      if (sessions.length > 0) {
                        window.location.href = `/workspace/${sessions[0].sessionId}?type=document&id=${file.fileId}`;
                      }
                    }}
                  >
                    <div className="w-8 h-8 rounded-lg bg-accent-soft flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                      <File className="w-4 h-4 text-accent" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-text-primary-light dark:text-text-primary-dark truncate">
                        {file.fileName}
                      </p>
                      <p className="text-[10px] text-text-muted-light">
                        {new Date(file.regdate || "").toLocaleDateString('ko-KR')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>

        {/* 내 세션 목록 섹션 */}
        <div className="space-y-4">
          <div className="flex flex-col gap-4">
            <h2 className="text-xl font-bold text-text-primary-light dark:text-text-primary-dark">
              내 세션 관리
            </h2>
            {/* 검색 및 정렬 바: 반응형 처리 (모바일 세로, 데스크탑 가로) */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <div className="flex-1">
                <SearchInput
                  value={searchQuery}
                  onChange={setSearchQuery}
                  placeholder="세션 제목 검색..."
                  className="w-full"
                />
              </div>
              <div className="flex items-center gap-2">
                <ToggleGroup
                  value={sortBy}
                  onChange={(v) => setSortBy(v as any)}
                  options={[
                    { value: "latest", label: "과거순", icon: <SortDesc className="w-4 h-4" /> },
                    { value: "oldest", label: "최신순", icon: <SortAsc className="w-4 h-4" /> },
                  ]}
                  size="md"
                  className="flex-1 sm:flex-none"
                />
              </div>
            </div>
          </div>

          {filteredSessions.length === 0 ? (
            <Card variant="default" padding="lg" className="border-dashed border-2">
              <EmptyState
                icon={<Folder className="w-12 h-12" />}
                title={searchQuery ? "검색 결과가 없습니다" : "진행 중인 세션이 없습니다"}
                description={searchQuery ? "검색어를 다시 확인해주세요" : "새로운 세션을 만들어 AI 분석을 시작하세요"}
              />
            </Card>
          ) : (
            <>
              <Card variant="default" padding="none" className="border-none shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="border-b border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark">
                    <tr>
                      <th className="px-5 py-4 text-xs font-bold text-text-muted-light dark:text-text-muted-dark uppercase tracking-wider">
                        세션 정보
                      </th>
                      {/* 모바일에서 생성일 숨김 */}
                      <th className="hidden md:table-cell px-5 py-4 text-xs font-bold text-text-muted-light dark:text-text-muted-dark uppercase tracking-wider">
                        생성일
                      </th>
                      <th className="px-5 py-4 text-xs font-bold text-text-muted-light dark:text-text-muted-dark uppercase tracking-wider">
                        최종 수정
                      </th>
                      <th className="px-5 py-4 text-right"></th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-border-light dark:divide-border-dark bg-white dark:bg-surface-dark/40">
                    {paginatedSessions.map((session) => (
                      <tr
                        key={session.sessionId}
                        className="hover:bg-surface-light dark:hover:bg-surface-dark cursor-pointer transition-colors"
                        onClick={() => window.location.href = `/workspace/${session.sessionId}`}
                      >
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-accent-soft flex items-center justify-center flex-shrink-0 shadow-sm text-accent">
                              <FolderOpen className="w-5 h-5" />
                            </div>
                            <div className="min-w-0">
                              <p className="text-sm font-bold text-text-primary-light dark:text-text-primary-dark truncate">
                                {session.sessionTitle}
                              </p>
                              <p className="text-xs text-text-muted-light dark:text-text-muted-dark truncate">
                                {session.description || "설명 없음"}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="hidden md:table-cell px-5 py-4">
                          <p className="text-xs text-text-muted-light flex items-center gap-1.5 font-medium">
                            <Calendar className="w-3.5 h-3.5" />
                            {new Date(session.regdate).toLocaleDateString('ko-KR')}
                          </p>
                        </td>
                        <td className="px-5 py-4">
                          <p className="text-xs text-text-muted-light flex items-center gap-1.5 font-medium">
                            <Clock className="w-3.5 h-3.5" />
                            {new Date(session.moddate || session.regdate).toLocaleDateString('ko-KR')}
                          </p>
                        </td>
                        <td className="px-5 py-4 text-right">
                          <button
                            className="p-2 rounded-full hover:bg-surface-light dark:hover:bg-surface-dark transition-colors"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <MoreVertical className="w-4 h-4 text-text-muted-light" />
                          </button>
                        </td>
                      </tr>
                    ))}
                    </tbody>
                  </table>
                </div>
              </Card>

              {/* 하단 페이지네이션 */}
              {totalPages > 1 && (
                <div className="mt-6 flex justify-center">
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