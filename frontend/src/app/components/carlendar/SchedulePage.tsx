// app/calendar/page.tsx
"use client";

import { useState } from "react";
import { DayPicker } from "react-day-picker";
import { ko } from "date-fns/locale";
import { format, isSameDay } from "date-fns";
import {
  ChevronLeft,
  ChevronRight,
  FileText,
  Sparkles,
  Mic,
  GitCompare,
  Calendar as CalendarIcon,
  Clock,
  TrendingUp,
  Filter,
  Search,
} from "lucide-react";
import "react-day-picker/dist/style.css";

export default function SchedulePage() {
  const [currentDate, setCurrentDate] = useState(new Date(2025, 11, 10));
  const [selectedDate, setSelectedDate] = useState(10);
  const [viewMode, setViewMode] = useState<"month" | "week">("month");
  const [filterType, setFilterType] = useState<"all" | "original" | "summary" | "voice" | "compare">("all");

  // Mock 데이터 - 실제로는 API에서 가져올 것
  const notesData = [
    {
      id: "1",
      date: 10,
      title: "3월 마케팅 전략 회의",
      time: "14:30",
      type: "summary",
      wordCount: 1234,
      tags: ["회의", "마케팅"],
    },
    {
      id: "2",
      date: 10,
      title: "FloCut 기획 정리",
      time: "11:20",
      type: "original",
      wordCount: 3456,
      tags: ["기획", "프로젝트"],
    },
    {
      id: "3",
      date: 10,
      title: "팀 회의 음성 기록",
      time: "09:15",
      type: "voice",
      wordCount: 2100,
      tags: ["회의"],
    },
    {
      id: "4",
      date: 15,
      title: "개발 일정 정리",
      time: "16:00",
      type: "original",
      wordCount: 890,
      tags: ["개발"],
    },
    {
      id: "5",
      date: 15,
      title: "2월 vs 3월 회의록 비교",
      time: "17:30",
      type: "compare",
      wordCount: 0,
      tags: ["비교"],
    },
    {
      id: "6",
      date: 20,
      title: "주간 회의록",
      time: "10:00",
      type: "summary",
      wordCount: 1567,
      tags: ["회의"],
    },
  ];

  const filteredNotes = filterType === "all"
    ? notesData
    : notesData.filter(note => note.type === filterType);

  const goToToday = () => {
    const today = new Date();
    setCurrentDate(today);
    setSelectedDate(today.getDate());
  };

  // react-day-picker를 위한 Date 객체로 변환
  const selectedDateObj = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    selectedDate
  );

  const selectedDateNotes = filteredNotes.filter((n) => n.date === selectedDate);

  // 문서가 있는 날짜들을 Date 객체 배열로 변환
  const noteDates = filteredNotes.map(
    (note) => new Date(currentDate.getFullYear(), currentDate.getMonth(), note.date)
  );

  const getNotesCountByDate = (date: Date) => {
    const day = date.getDate();
    return filteredNotes.filter((n) => n.date === day).length;
  };

  const getNoteIcon = (type: string) => {
    switch (type) {
      case "summary":
        return <Sparkles size={14} className="text-blue-500" />;
      case "voice":
        return <Mic size={14} className="text-green-500" />;
      case "compare":
        return <GitCompare size={14} className="text-purple-500" />;
      default:
        return <FileText size={14} className="text-gray-500" />;
    }
  };

  const getNoteTypeBadge = (type: string) => {
    const badges = {
      summary: { label: "요약", color: "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400" },
      voice: { label: "음성", color: "bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400" },
      compare: { label: "비교", color: "bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400" },
      original: { label: "원본", color: "bg-gray-50 text-gray-600 dark:bg-gray-900/20 dark:text-gray-400" },
    };
    return badges[type] || badges.original;
  };

  // 월별 통계 계산
  const monthStats = {
    total: filteredNotes.length,
    summaries: filteredNotes.filter((n) => n.type === "summary").length,
    voice: filteredNotes.filter((n) => n.type === "voice").length,
    compares: filteredNotes.filter((n) => n.type === "compare").length,
    totalWords: filteredNotes.reduce((sum, n) => sum + n.wordCount, 0),
  };

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark">
      {/* 헤더 */}
      <header className="border-b border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CalendarIcon className="text-accent" size={24} />
              <h1 className="text-xl font-bold text-text-primary-light dark:text-text-primary-dark">
                문서 캘린더
              </h1>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={goToToday}
                className="px-4 py-2 text-sm font-medium rounded-lg border border-border-light dark:border-border-dark hover:bg-surface-hover dark:hover:bg-surface-input transition-colors"
              >
                오늘
              </button>
              <div className="flex items-center gap-1 px-2 py-1 rounded-lg border border-border-light dark:border-border-dark">
                <button
                  onClick={() => setViewMode("month")}
                  className={`px-3 py-1 text-sm rounded transition-colors ${
                    viewMode === "month"
                      ? "bg-accent text-white"
                      : "text-text-muted-light dark:text-text-muted-dark hover:bg-surface-hover dark:hover:bg-surface-input"
                  }`}
                >
                  월
                </button>
                <button
                  onClick={() => setViewMode("week")}
                  className={`px-3 py-1 text-sm rounded transition-colors ${
                    viewMode === "week"
                      ? "bg-accent text-white"
                      : "text-text-muted-light dark:text-text-muted-dark hover:bg-surface-hover dark:hover:bg-surface-input"
                  }`}
                >
                  주
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 메인 캘린더 영역 */}
          <div className="lg:col-span-2 space-y-6">
            {/* 캘린더 컨트롤 */}
            <div className="bg-surface-light dark:bg-surface-dark rounded-xl border border-border-light dark:border-border-dark p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-text-primary-light dark:text-text-primary-dark">
                  {format(currentDate, "yyyy년 M월", { locale: ko })}
                </h2>

                {/* 필터 */}
                <div className="flex items-center gap-2">
                  <Filter size={16} className="text-text-muted-light dark:text-text-muted-dark" />
                  <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value as any)}
                    className="px-3 py-1.5 text-sm rounded-lg border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark"
                  >
                    <option value="all">전체</option>
                    <option value="original">원본</option>
                    <option value="summary">요약</option>
                    <option value="voice">음성</option>
                    <option value="compare">비교</option>
                  </select>
                </div>
              </div>

              {/* react-day-picker 캘린더 */}
              <div className="flocut-calendar">
                <DayPicker
                  mode="single"
                  selected={selectedDateObj}
                  onSelect={(date) => {
                    if (date) {
                      setCurrentDate(date);
                      setSelectedDate(date.getDate());
                    }
                  }}
                  month={currentDate}
                  onMonthChange={setCurrentDate}
                  locale={ko}
                  modifiers={{
                    hasNotes: noteDates,
                  }}
                  modifiersClassNames={{
                    hasNotes: "has-notes",
                  }}
                  components={{
                    DayContent: (props) => {
                      const notesCount = getNotesCountByDate(props.date);
                      const isToday = isSameDay(props.date, new Date());

                      return (
                        <div className="relative w-full h-full flex items-center justify-center group">
                          <span className={isToday && !props.activeModifiers.selected ? "font-bold" : ""}>
                            {props.date.getDate()}
                          </span>
                          {notesCount > 0 && !props.activeModifiers.selected && (
                            <div className="absolute bottom-1 left-1/2 -translate-x-1/2 flex gap-0.5">
                              {Array.from({ length: Math.min(notesCount, 3) }).map((_, i) => (
                                <div
                                  key={i}
                                  className="w-1 h-1 rounded-full bg-accent"
                                />
                              ))}
                            </div>
                          )}
                          {notesCount > 0 && (
                            <div className="absolute -top-1 -right-1 w-5 h-5 bg-accent text-white text-xs rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                              {notesCount}
                            </div>
                          )}
                        </div>
                      );
                    },
                  }}
                />
              </div>
            </div>

            {/* 선택된 날짜의 문서 목록 */}
            <div className="bg-surface-light dark:bg-surface-dark rounded-xl border border-border-light dark:border-border-dark p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-text-primary-light dark:text-text-primary-dark">
                  {selectedDate}일 작성한 문서
                  {selectedDateNotes.length > 0 && (
                    <span className="ml-2 text-sm text-accent font-normal">
                      {selectedDateNotes.length}개
                    </span>
                  )}
                </h3>
                <button className="text-sm text-accent hover:underline flex items-center gap-1">
                  <Search size={14} />
                  전체 보기
                </button>
              </div>

              {selectedDateNotes.length > 0 ? (
                <div className="space-y-3">
                  {selectedDateNotes
                    .sort((a, b) => a.time.localeCompare(b.time))
                    .map((note) => {
                      const badge = getNoteTypeBadge(note.type);
                      return (
                        <div
                          key={note.id}
                          className="p-4 rounded-lg border border-border-light dark:border-border-dark hover:border-accent dark:hover:border-accent transition-all hover:shadow-md bg-background-light dark:bg-background-dark group cursor-pointer"
                        >
                          <div className="flex items-start gap-3">
                            <div className="mt-1">{getNoteIcon(note.type)}</div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-2 mb-2">
                                <h4 className="font-semibold text-sm truncate group-hover:text-accent transition-colors">
                                  {note.title}
                                </h4>
                                <span className={`text-xs px-2 py-0.5 rounded-full whitespace-nowrap ${badge.color}`}>
                                  {badge.label}
                                </span>
                              </div>

                              <div className="flex items-center gap-3 text-xs text-text-muted-light dark:text-text-muted-dark mb-2">
                                <span className="flex items-center gap-1">
                                  <Clock size={12} />
                                  {note.time}
                                </span>
                                {note.wordCount > 0 && (
                                  <>
                                    <span>•</span>
                                    <span>{note.wordCount.toLocaleString()}자</span>
                                  </>
                                )}
                              </div>

                              <div className="flex items-center gap-2">
                                {note.tags.map((tag) => (
                                  <span
                                    key={tag}
                                    className="text-xs px-2 py-0.5 rounded bg-surface-hover dark:bg-surface-input"
                                  >
                                    #{tag}
                                  </span>
                                ))}
                              </div>

                              {/* 호버시 액션 버튼 */}
                              <div className="mt-3 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button className="text-xs px-3 py-1.5 rounded-md bg-accent-soft text-accent hover:bg-accent hover:text-white transition-colors">
                                  열기
                                </button>
                                <button className="text-xs px-3 py-1.5 rounded-md border border-border-light dark:border-border-dark hover:border-accent hover:text-accent transition-colors">
                                  AI 피드백
                                </button>
                                {note.type !== "compare" && (
                                  <button className="text-xs px-3 py-1.5 rounded-md border border-border-light dark:border-border-dark hover:border-accent hover:text-accent transition-colors">
                                    비교하기
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-surface-hover dark:bg-surface-input flex items-center justify-center">
                    <FileText size={24} className="text-text-muted-light dark:text-text-muted-dark" />
                  </div>
                  <p className="text-sm text-text-muted-light dark:text-text-muted-dark">
                    이 날짜에 작성된 문서가 없습니다
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* 사이드바 - 통계 & 인사이트 */}
          <div className="space-y-6">
            {/* 이번 달 통계 */}
            <div className="bg-surface-light dark:bg-surface-dark rounded-xl border border-border-light dark:border-border-dark p-6">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp size={18} className="text-accent" />
                <h3 className="font-bold text-text-primary-light dark:text-text-primary-dark">
                  이번 달 통계
                </h3>
              </div>

              <div className="space-y-4">
                <div className="p-4 rounded-lg bg-accent-soft">
                  <p className="text-2xl font-bold text-accent mb-1">
                    {monthStats.total}
                  </p>
                  <p className="text-xs text-text-muted-light dark:text-text-muted-dark">
                    총 문서 수
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-lg bg-background-light dark:bg-background-dark border border-border-light dark:border-border-dark">
                    <p className="text-lg font-bold text-blue-500 mb-1">
                      {monthStats.summaries}
                    </p>
                    <p className="text-xs text-text-muted-light dark:text-text-muted-dark">
                      요약
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-background-light dark:bg-background-dark border border-border-light dark:border-border-dark">
                    <p className="text-lg font-bold text-green-500 mb-1">
                      {monthStats.voice}
                    </p>
                    <p className="text-xs text-text-muted-light dark:text-text-muted-dark">
                      음성
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-background-light dark:bg-background-dark border border-border-light dark:border-border-dark">
                    <p className="text-lg font-bold text-purple-500 mb-1">
                      {monthStats.compares}
                    </p>
                    <p className="text-xs text-text-muted-light dark:text-text-muted-dark">
                      비교
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-background-light dark:bg-background-dark border border-border-light dark:border-border-dark">
                    <p className="text-lg font-bold text-accent mb-1">
                      {(monthStats.totalWords / 1000).toFixed(1)}k
                    </p>
                    <p className="text-xs text-text-muted-light dark:text-text-muted-dark">
                      총 글자 수
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* AI 인사이트 */}
            <div className="bg-gradient-to-br from-accent/10 to-accent/5 rounded-xl border border-accent/20 p-6">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles size={18} className="text-accent" />
                <h3 className="font-bold text-text-primary-light dark:text-text-primary-dark">
                  AI 인사이트
                </h3>
              </div>

              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-accent mt-1.5"></div>
                  <p className="text-text-primary-light dark:text-text-primary-dark">
                    <strong>가장 활발한 날:</strong> 10일 (3개 문서)
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-accent mt-1.5"></div>
                  <p className="text-text-primary-light dark:text-text-primary-dark">
                    <strong>주요 주제:</strong> 회의, 기획, 개발
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-accent mt-1.5"></div>
                  <p className="text-text-primary-light dark:text-text-primary-dark">
                    <strong>작성 패턴:</strong> 오후 시간대 집중
                  </p>
                </div>
              </div>

              <button className="w-full mt-4 px-4 py-2 bg-accent hover:bg-accent-hover text-white rounded-lg transition-colors text-sm font-medium">
                상세 분석 보기
              </button>
            </div>

            {/* 최근 비교 기록 */}
            <div className="bg-surface-light dark:bg-surface-dark rounded-xl border border-border-light dark:border-border-dark p-6">
              <h3 className="font-bold text-text-primary-light dark:text-text-primary-dark mb-4">
                최근 비교 기록
              </h3>
              <div className="space-y-3">
                <div className="p-3 rounded-lg bg-background-light dark:bg-background-dark border border-border-light dark:border-border-dark hover:border-accent transition-colors cursor-pointer">
                  <p className="text-sm font-medium mb-1">2월 vs 3월 회의록</p>
                  <p className="text-xs text-text-muted-light dark:text-text-muted-dark">
                    3일 전
                  </p>
                </div>
                <button className="w-full py-2 text-sm text-accent hover:underline">
                  전체 보기 →
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}