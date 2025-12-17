// components/layout/WorkspaceLayout/ContextPanel.tsx
"use client";

import { useState } from "react";
import {
    X,
    Info,
    Clock,
    MessageCircle,
    Sparkles,
    MessageSquare,
    GitCompare,
    Calendar,
    Tag,
    User,
    ChevronRight,
    ChevronLeft,
    Plus,
} from "lucide-react";

interface ContextPanelProps {
    mode:
        | "properties"
        | "ai-summary"
        | "ai-feedback"
        | "ai-compare"
        | "versions"
        | "comments"
        | "calendar"; // 추가
    noteId: string;
    onClose: () => void;
    onChangeMode: (
        mode:
            | "properties"
            | "ai-summary"
            | "ai-feedback"
            | "ai-compare"
            | "versions"
            | "comments"
            | "calendar" // 추가
    ) => void;
}

export default function ContextPanel({
                                         mode,
                                         noteId,
                                         onClose,
                                         onChangeMode,
                                     }: ContextPanelProps) {
    const [width, setWidth] = useState(360);
    const [isResizing, setIsResizing] = useState(false);

    const tabs = [
        { id: "properties", label: "속성", icon: Info },
        { id: "calendar", label: "캘린더", icon: Calendar },
        { id: "ai-summary", label: "AI 요약", icon: Sparkles },
        { id: "ai-feedback", label: "피드백", icon: MessageSquare },
        { id: "ai-compare", label: "비교", icon: GitCompare },
        { id: "versions", label: "버전", icon: Clock },
        { id: "comments", label: "댓글", icon: MessageCircle },
    ];

    const renderContent = () => {
        switch (mode) {
            case "properties":
                return <PropertiesContent />;
            case "calendar":
                return <CalendarContent />;
            case "ai-summary":
                return <AISummaryContent />;
            case "ai-feedback":
                return <AIFeedbackContent />;
            case "ai-compare":
                return <AICompareContent />;
            case "versions":
                return <VersionsContent />;
            case "comments":
                return <CommentsContent />;
            default:
                return null;
        }
    };

    return (
        <aside
            style={{ width: `${width}px` }}
            className="relative border-l border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark flex flex-col"
        >
            {/* 리사이즈 핸들 */}
            <div
                onMouseDown={(e) => {
                    e.preventDefault();
                    setIsResizing(true);
                }}
                className="absolute left-0 top-0 w-1 h-full cursor-col-resize hover:bg-accent transition-colors z-10"
            />

            {/* 헤더 */}
            <div className="h-14 px-4 flex items-center justify-between border-b border-border-light dark:border-border-dark">
                <div className="flex items-center gap-2">
                    {tabs.find((t) => t.id === mode)?.icon &&
                        (() => {
                            const Icon = tabs.find((t) => t.id === mode)!.icon;
                            return <Icon size={18} className="text-accent" />;
                        })()}
                    <h2 className="text-sm font-semibold text-text-primary-light dark:text-text-primary-dark">
                        {tabs.find((t) => t.id === mode)?.label}
                    </h2>
                </div>
                <button
                    onClick={onClose}
                    className="p-1.5 hover:bg-surface-hover dark:hover:bg-surface-input rounded transition-colors"
                >
                    <X size={16} />
                </button>
            </div>

            {/* 탭 네비게이션 */}
            <div className="flex items-center gap-1 px-2 py-2 border-b border-border-light dark:border-border-dark overflow-x-auto">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => onChangeMode(tab.id as any)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium transition-colors whitespace-nowrap ${
                            mode === tab.id
                                ? "bg-accent-soft text-accent"
                                : "text-text-muted-light dark:text-text-muted-dark hover:bg-surface-hover dark:hover:bg-surface-input"
                        }`}
                    >
                        <tab.icon size={14} />
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* 콘텐츠 */}
            <div className="flex-1 overflow-y-auto">{renderContent()}</div>
        </aside>
    );
}

// ===== 캘린더 패널 =====
function CalendarContent() {
    const [currentDate, setCurrentDate] = useState(new Date(2025, 11, 10)); // 2025년 12월 10일
    const [selectedDate, setSelectedDate] = useState(10);
    const [view, setView] = useState<"calendar" | "schedule">("calendar");

    // 해당 월의 일정이 있는 노트들 (Mock 데이터)
    const notesInMonth = [
        { id: "1", date: 10, title: "3월 마케팅 회의", time: "14:30" },
        { id: "2", date: 10, title: "FloCut 기획 정리", time: "11:20" },
        { id: "3", date: 15, title: "개발 일정 정리", time: "09:15" },
        { id: "4", date: 20, title: "주간 회의", time: "16:00" },
    ];

    // 일정 데이터 (별도 일정)
    const schedules = [
        { id: "s1", date: 10, title: "팀 미팅", time: "10:00", type: "meeting" },
        { id: "s2", date: 12, title: "프로젝트 마감", time: "18:00", type: "deadline" },
        { id: "s3", date: 15, title: "1:1 미팅", time: "15:00", type: "meeting" },
    ];

    const daysInMonth = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() + 1,
        0
    ).getDate();

    const firstDayOfMonth = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        1
    ).getDay();

    const prevMonth = () => {
        setCurrentDate(
            new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
        );
    };

    const nextMonth = () => {
        setCurrentDate(
            new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
        );
    };

    const selectedDateNotes = notesInMonth.filter((n) => n.date === selectedDate);
    const selectedDateSchedules = schedules.filter((s) => s.date === selectedDate);

    const hasContentOnDate = (day: number) => {
        return (
            notesInMonth.some((n) => n.date === day) ||
            schedules.some((s) => s.date === day)
        );
    };

    return (
        <div className="flex flex-col h-full">
            {/* 탭 전환 */}
            <div className="flex items-center gap-1 p-2 border-b border-border-light dark:border-border-dark">
                <button
                    onClick={() => setView("calendar")}
                    className={`flex-1 px-3 py-2 rounded text-sm font-medium transition-colors ${
                        view === "calendar"
                            ? "bg-accent text-white"
                            : "text-text-muted-light dark:text-text-muted-dark hover:bg-surface-hover dark:hover:bg-surface-input"
                    }`}
                >
                    캘린더
                </button>
                <button
                    onClick={() => setView("schedule")}
                    className={`flex-1 px-3 py-2 rounded text-sm font-medium transition-colors ${
                        view === "schedule"
                            ? "bg-accent text-white"
                            : "text-text-muted-light dark:text-text-muted-dark hover:bg-surface-hover dark:hover:bg-surface-input"
                    }`}
                >
                    일정 관리
                </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
                {view === "calendar" ? (
                    <>
                        {/* 월 선택 */}
                        <div className="flex items-center justify-between mb-4">
                            <button
                                onClick={prevMonth}
                                className="p-1 hover:bg-surface-hover dark:hover:bg-surface-input rounded transition-colors"
                            >
                                <ChevronLeft size={16} />
                            </button>
                            <h3 className="text-sm font-semibold">
                                {currentDate.getFullYear()}년 {currentDate.getMonth() + 1}월
                            </h3>
                            <button
                                onClick={nextMonth}
                                className="p-1 hover:bg-surface-hover dark:hover:bg-surface-input rounded transition-colors"
                            >
                                <ChevronRight size={16} />
                            </button>
                        </div>

                        {/* 요일 헤더 */}
                        <div className="grid grid-cols-7 gap-1 text-center text-xs mb-2">
                            {["일", "월", "화", "수", "목", "금", "토"].map((day, idx) => (
                                <div
                                    key={day}
                                    className={`py-2 font-medium ${
                                        idx === 0
                                            ? "text-red-500"
                                            : idx === 6
                                                ? "text-blue-500"
                                                : "text-text-muted-light dark:text-text-muted-dark"
                                    }`}
                                >
                                    {day}
                                </div>
                            ))}
                        </div>

                        {/* 날짜 그리드 */}
                        <div className="grid grid-cols-7 gap-1 text-center">
                            {/* 빈 칸 (이전 달) */}
                            {Array.from({ length: firstDayOfMonth }, (_, i) => (
                                <div key={`empty-${i}`} className="py-2"></div>
                            ))}

                            {/* 날짜 */}
                            {Array.from({ length: daysInMonth }, (_, i) => {
                                const day = i + 1;
                                const isSelected = day === selectedDate;
                                const hasContent = hasContentOnDate(day);

                                return (
                                    <button
                                        key={day}
                                        onClick={() => setSelectedDate(day)}
                                        className={`relative py-2 rounded-md transition-colors text-sm ${
                                            isSelected
                                                ? "bg-accent text-white font-semibold"
                                                : "text-text-primary-light dark:text-text-primary-dark hover:bg-surface-hover dark:hover:bg-surface-input"
                                        }`}
                                    >
                                        {day}
                                        {hasContent && !isSelected && (
                                            <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-accent"></div>
                                        )}
                                    </button>
                                );
                            })}
                        </div>

                        {/* 선택된 날짜의 노트 */}
                        <div className="mt-6">
                            <h3 className="text-xs font-semibold mb-3 text-text-muted-light dark:text-text-muted-dark flex items-center justify-between">
                                <span>{selectedDate}일의 노트</span>
                                {selectedDateNotes.length > 0 && (
                                    <span className="text-accent">{selectedDateNotes.length}개</span>
                                )}
                            </h3>

                            {selectedDateNotes.length > 0 ? (
                                <div className="space-y-2">
                                    {selectedDateNotes.map((note) => (
                                        <button
                                            key={note.id}
                                            className="w-full p-3 rounded-lg bg-background-light dark:bg-background-dark border border-border-light dark:border-border-dark hover:border-accent transition-colors text-left"
                                        >
                                            <p className="text-sm font-medium truncate mb-1">
                                                {note.title}
                                            </p>
                                            <p className="text-xs text-text-muted-light dark:text-text-muted-dark">
                                                {note.time}
                                            </p>
                                        </button>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-xs text-text-muted-light dark:text-text-muted-dark text-center py-4">
                                    노트가 없습니다
                                </p>
                            )}

                            {/* 선택된 날짜의 일정 */}
                            {selectedDateSchedules.length > 0 && (
                                <>
                                    <h3 className="text-xs font-semibold mt-4 mb-3 text-text-muted-light dark:text-text-muted-dark flex items-center justify-between">
                                        <span>일정</span>
                                        <span className="text-accent">{selectedDateSchedules.length}개</span>
                                    </h3>
                                    <div className="space-y-2">
                                        {selectedDateSchedules.map((schedule) => (
                                            <div
                                                key={schedule.id}
                                                className="p-3 rounded-lg bg-accent-soft border border-accent/20"
                                            >
                                                <p className="text-sm font-medium text-accent mb-1">
                                                    {schedule.title}
                                                </p>
                                                <p className="text-xs text-text-muted-light dark:text-text-muted-dark">
                                                    {schedule.time}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </>
                            )}
                        </div>
                    </>
                ) : (
                    // 일정 관리 뷰
                    <>
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-sm font-semibold">전체 일정</h3>
                            <button className="p-1.5 rounded-md bg-accent hover:bg-accent-hover text-white transition-colors">
                                <Plus size={16} />
                            </button>
                        </div>

                        <div className="space-y-2">
                            {schedules.map((schedule) => (
                                <div
                                    key={schedule.id}
                                    className="p-3 rounded-lg bg-background-light dark:bg-background-dark border border-border-light dark:border-border-dark hover:border-accent transition-colors"
                                >
                                    <div className="flex items-start justify-between mb-1">
                                        <p className="text-sm font-medium">{schedule.title}</p>
                                        <button className="p-1 hover:bg-surface-hover dark:hover:bg-surface-input rounded transition-colors">
                                            <X size={12} />
                                        </button>
                                    </div>
                                    <p className="text-xs text-text-muted-light dark:text-text-muted-dark">
                                        {currentDate.getMonth() + 1}월 {schedule.date}일 • {schedule.time}
                                    </p>
                                </div>
                            ))}
                        </div>

                        {/* 새 일정 추가 버튼 */}
                        <button className="w-full mt-4 px-4 py-2 border-2 border-dashed border-border-light dark:border-border-dark rounded-lg hover:border-accent hover:bg-accent-soft transition-colors text-sm text-text-muted-light dark:text-text-muted-dark hover:text-accent">
                            + 새 일정 추가
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}

// ===== 속성 패널 =====
function PropertiesContent() {
    return (
        <div className="p-4 space-y-4">
            <div>
                <label className="block text-xs font-medium text-text-muted-light dark:text-text-muted-dark mb-2">
                    생성일
                </label>
                <div className="flex items-center gap-2 text-sm text-text-primary-light dark:text-text-primary-dark">
                    <Calendar size={14} />
                    <span>2024년 12월 16일</span>
                </div>
            </div>

            <div>
                <label className="block text-xs font-medium text-text-muted-light dark:text-text-muted-dark mb-2">
                    마지막 수정
                </label>
                <div className="flex items-center gap-2 text-sm text-text-primary-light dark:text-text-primary-dark">
                    <Clock size={14} />
                    <span>2시간 전</span>
                </div>
            </div>

            <div>
                <label className="block text-xs font-medium text-text-muted-light dark:text-text-muted-dark mb-2">
                    작성자
                </label>
                <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-accent flex items-center justify-center">
                        <User size={12} className="text-white" />
                    </div>
                    <span className="text-sm text-text-primary-light dark:text-text-primary-dark">
            김철수
          </span>
                </div>
            </div>

            <div>
                <label className="block text-xs font-medium text-text-muted-light dark:text-text-muted-dark mb-2">
                    태그
                </label>
                <div className="flex flex-wrap gap-2">
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-surface-hover dark:bg-surface-input rounded text-xs">
            <Tag size={12} />
            회의
          </span>
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-surface-hover dark:bg-surface-input rounded text-xs">
            <Tag size={12} />
            마케팅
          </span>
                    <button className="px-2 py-1 border border-dashed border-border-light dark:border-border-dark rounded text-xs hover:border-accent transition-colors">
                        + 추가
                    </button>
                </div>
            </div>

            <div>
                <label className="block text-xs font-medium text-text-muted-light dark:text-text-muted-dark mb-2">
                    문서 통계
                </label>
                <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
            <span className="text-text-muted-light dark:text-text-muted-dark">
              글자 수
            </span>
                        <span className="font-medium">1,234</span>
                    </div>
                    <div className="flex justify-between">
            <span className="text-text-muted-light dark:text-text-muted-dark">
              단어 수
            </span>
                        <span className="font-medium">456</span>
                    </div>
                    <div className="flex justify-between">
            <span className="text-text-muted-light dark:text-text-muted-dark">
              예상 읽기 시간
            </span>
                        <span className="font-medium">3분</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

// ===== AI 요약 패널 =====
function AISummaryContent() {
    return (
        <div className="p-4 space-y-4">
            <div className="p-4 rounded-lg bg-background-light dark:bg-background-dark border border-border-light dark:border-border-dark">
                <div className="flex items-start gap-2 mb-3">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent to-accent-hover flex items-center justify-center flex-shrink-0">
                        <Sparkles size={16} className="text-white" />
                    </div>
                    <div className="flex-1">
                        <h3 className="text-sm font-semibold mb-1">핵심 요약</h3>
                        <p className="text-xs text-text-muted-light dark:text-text-muted-dark">
                            AI가 문서를 분석하여 생성한 요약입니다
                        </p>
                    </div>
                </div>

                <p className="text-sm leading-relaxed mb-4">
                    이 문서는 3월 마케팅 전략에 대한 회의 내용을 담고 있습니다. 주요
                    논의사항으로는 Q1 성과 분석, Q2 목표 설정, 신규 캠페인 기획이
                    포함되어 있습니다.
                </p>

                <div className="space-y-2">
                    <h4 className="text-xs font-semibold text-text-muted-light dark:text-text-muted-dark">
                        주요 포인트
                    </h4>
                    <ul className="space-y-1.5 text-sm">
                        <li className="flex items-start gap-2">
                            <ChevronRight size={14} className="mt-0.5 flex-shrink-0 text-accent" />
                            <span>Q1 매출 목표 달성률 115%</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <ChevronRight size={14} className="mt-0.5 flex-shrink-0 text-accent" />
                            <span>소셜 미디어 참여율 30% 증가</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <ChevronRight size={14} className="mt-0.5 flex-shrink-0 text-accent" />
                            <span>신규 고객 확보 2,500명</span>
                        </li>
                    </ul>
                </div>
            </div>

            <button className="w-full px-4 py-2 bg-accent hover:bg-accent-hover text-white rounded-lg transition-colors font-medium text-sm">
                에디터에 적용
            </button>

            <button className="w-full px-4 py-2 border border-border-light dark:border-border-dark hover:bg-surface-hover dark:hover:bg-surface-input rounded-lg transition-colors text-sm">
                다시 생성
            </button>
        </div>
    );
}

// ===== AI 피드백 패널 =====
function AIFeedbackContent() {
    return (
        <div className="p-4 space-y-4">
            <div className="p-4 rounded-lg bg-background-light dark:bg-background-dark border border-border-light dark:border-border-dark">
                <h3 className="text-sm font-semibold mb-3">문서 구조 분석</h3>
                <div className="space-y-3">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <div className="w-2 h-2 rounded-full bg-green-500"></div>
                            <span className="text-xs font-medium">논리 흐름</span>
                        </div>
                        <p className="text-xs text-text-muted-light dark:text-text-muted-dark">
                            문서의 논리적 구조가 명확합니다.
                        </p>
                    </div>

                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                            <span className="text-xs font-medium">상세도</span>
                        </div>
                        <p className="text-xs text-text-muted-light dark:text-text-muted-dark">
                            일부 섹션에 구체적인 수치나 근거가 부족합니다.
                        </p>
                    </div>

                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <div className="w-2 h-2 rounded-full bg-green-500"></div>
                            <span className="text-xs font-medium">가독성</span>
                        </div>
                        <p className="text-xs text-text-muted-light dark:text-text-muted-dark">
                            적절한 제목과 목록 구조로 읽기 편합니다.
                        </p>
                    </div>
                </div>
            </div>

            <div className="p-4 rounded-lg bg-accent-soft border border-accent/20">
                <h4 className="text-sm font-semibold mb-2 text-accent">개선 제안</h4>
                <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                        <span className="text-accent">•</span>
                        <span>각 액션 아이템에 구체적인 마감일을 추가하세요</span>
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="text-accent">•</span>
                        <span>경쟁사 분석 섹션에 정량적 지표를 포함하세요</span>
                    </li>
                </ul>
            </div>
        </div>
    );
}

// ===== AI 비교 패널 =====
function AICompareContent() {
    return (
        <div className="p-4 space-y-4">
            <div>
                <label className="block text-xs font-medium text-text-muted-light dark:text-text-muted-dark mb-2">
                    비교할 문서 선택
                </label>
                <select className="w-full px-3 py-2 rounded-lg border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark text-sm">
                    <option>2월 마케팅 회의</option>
                    <option>1월 마케팅 회의</option>
                    <option>Q4 전략 회의</option>
                </select>
            </div>

            <div className="space-y-2">
                <div className="p-3 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
                    <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold text-green-700 dark:text-green-400">
              추가됨
            </span>
                    </div>
                    <p className="text-xs">신규 고객 확보 목표 설정</p>
                </div>

                <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                    <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold text-red-700 dark:text-red-400">
              삭제됨
            </span>
                    </div>
                    <p className="text-xs">오프라인 이벤트 계획</p>
                </div>

                <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
                    <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold text-blue-700 dark:text-blue-400">
              수정됨
            </span>
                    </div>
                    <p className="text-xs">매출 목표: 100% → 115%</p>
                </div>
            </div>

            <button className="w-full px-4 py-2 bg-accent hover:bg-accent-hover text-white rounded-lg transition-colors font-medium text-sm">
                상세 비교 보기
            </button>
        </div>
    );
}

// ===== 버전 기록 패널 =====
function VersionsContent() {
    const versions = [
        { id: 1, date: "2시간 전", author: "김철수", changes: "액션 아이템 추가" },
        { id: 2, date: "5시간 전", author: "김철수", changes: "Q1 성과 수정" },
        { id: 3, date: "어제", author: "이영희", changes: "회의록 초안 작성" },
    ];

    return (
        <div className="p-4 space-y-2">
            {versions.map((version) => (
                <button
                    key={version.id}
                    className="w-full p-3 rounded-lg border border-border-light dark:border-border-dark hover:border-accent dark:hover:border-accent bg-background-light dark:bg-background-dark transition-colors text-left"
                >
                    <div className="flex items-start justify-between mb-1">
                        <span className="text-xs font-medium">{version.changes}</span>
                        <span className="text-xs text-text-muted-light dark:text-text-muted-dark">
              {version.date}
            </span>
                    </div>
                    <p className="text-xs text-text-muted-light dark:text-text-muted-dark">
                        {version.author}
                    </p>
                </button>
            ))}
        </div>
    );
}

// ===== 댓글 패널 =====
function CommentsContent() {
    return (
        <div className="flex flex-col h-full">
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
                <div className="flex items-start gap-2">
                    <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center flex-shrink-0">
                        <User size={14} className="text-white" />
                    </div>
                    <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-medium">이영희</span>
                            <span className="text-xs text-text-muted-light dark:text-text-muted-dark">
                3시간 전
              </span>
                        </div>
                        <p className="text-sm">
                            Q2 목표가 너무 높은 것 같은데, 재검토가 필요할 것 같습니다.
                        </p>
                    </div>
                </div>
            </div>

            <div className="border-t border-border-light dark:border-border-dark p-4">
        <textarea
            placeholder="댓글 작성..."
            className="w-full px-3 py-2 rounded-lg border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark text-sm resize-none"
            rows={3}
        />
                <div className="flex justify-end mt-2">
                    <button className="px-4 py-1.5 bg-accent hover:bg-accent-hover text-white rounded-md transition-colors text-sm font-medium">
                        작성
                    </button>
                </div>
            </div>
        </div>
    );
}