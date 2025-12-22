"use client";

import { useState } from "react";
import Link from "next/link";
import {
  FileText,
  Mic,
  GitCompare,
  Trash2,
  Search,
  Plus,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Upload,
  Zap,
  MessageSquare,
} from "lucide-react";

export default function DocumentsPage() {
  const [activeTab, setActiveTab] = useState("document");
  const [selectedDate, setSelectedDate] = useState(16);
  const [sidebarWidth, setSidebarWidth] = useState(240);
  const [isResizing, setIsResizing] = useState(false);

  /* ================= MOCK DATA ================= */
  const documents = [
    { id: 1, title: "플로컷 회의 요약 #1", type: "문서", date: "2025.12.16", time: "14:30", summary: "AI 기반 문서 요약 플랫폼 개발 회의록" },
    { id: 2, title: "플로컷 회의 요약 #2", type: "문서", date: "2025.12.16", time: "11:20", summary: "프론트엔드 UI/UX 디자인 논의" },
    { id: 3, title: "플로컷 회의 요약 #3", type: "음성", date: "2025.12.15", time: "16:45", summary: "STT 기능 구현 및 테스트 계획" },
    { id: 4, title: "플로컷 회의 요약 #4", type: "문서", date: "2025.12.15", time: "09:15", summary: "GraphQL API 설계 및 데이터 구조" },
    { id: 5, title: "플로컷 회의 요약 #5", type: "비교", date: "2025.12.14", time: "13:00", summary: "버전 비교 기능 개발 진행 상황" },
  ];

  const schedules = [
    { date: 16, title: "플로컷 회의 요약 #1", time: "14:30" },
    { date: 16, title: "플로컷 회의 요약 #2", time: "11:20" },
    { date: 15, title: "플로컷 회의 요약 #3", time: "16:45" },
  ];

  const filteredSchedules = schedules.filter(
    (s) => s.date === selectedDate
  );

  /* ================= RESIZE ================= */
  const handleMouseDown = () => setIsResizing(true);
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isResizing) return;
    const w = e.clientX;
    if (w >= 200 && w <= 400) setSidebarWidth(w);
  };
  const handleMouseUp = () => setIsResizing(false);

  /* ================= CALENDAR ================= */
  const renderCalendar = () => {
    return Array.from({ length: 31 }, (_, i) => {
      const day = i + 1;
      const hasSchedule = schedules.some((s) => s.date === day);

      return (
        <button
          key={day}
          onClick={() => setSelectedDate(day)}
          className={`
            aspect-square rounded-md text-xs
            flex items-center justify-center
            border
            ${
            day === selectedDate
              ? "border-gray-900 dark:border-gray-100 font-medium"
              : "border-transparent hover:border-gray-300 dark:hover:border-gray-700"
          }
          `}
        >
          {day}
          {hasSchedule && (
            <span className="absolute bottom-1 w-1 h-1 rounded-full bg-red-500" />
          )}
        </button>
      );
    });
  };

  return (
    <div
      className="flex h-screen bg-white dark:bg-gray-950"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      {/* ================= LEFT SIDEBAR ================= */}
      <aside
        className="relative flex flex-col border-r border-gray-200 dark:border-gray-800"
        style={{ width: sidebarWidth }}
      >
        <div className="p-3 border-b border-gray-200 dark:border-gray-800">
          <button className="w-full flex items-center justify-center gap-2 py-2 rounded-md border border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900">
            <Plus size={16} />
            새 문서 만들기
          </button>
        </div>

        <nav className="flex-1 p-2 space-y-0.5">
          {[
            ["document", FileText, "문서 요약"],
            ["voice", Mic, "음성 요약"],
            ["compare", GitCompare, "비교 기록"],
            ["trash", Trash2, "휴지통"],
          ].map(([key, Icon, label]: any) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`
                w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-sm
                ${
                activeTab === key
                  ? "border border-gray-300 dark:border-gray-700"
                  : "hover:bg-gray-50 dark:hover:bg-gray-900"
              }
              `}
            >
              <Icon size={16} />
              {label}
            </button>
          ))}
        </nav>

        <div
          className="absolute top-0 right-0 w-1 h-full cursor-col-resize hover:bg-gray-300 dark:hover:bg-gray-700"
          onMouseDown={handleMouseDown}
        />
      </aside>

      {/* ================= MAIN ================= */}
      <main className="flex-1 flex flex-col">
        {/* Search Bar */}
        <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-800">
          <div className="flex items-center gap-2 max-w-5xl">
            <div className="relative flex-1">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                placeholder="문서 검색"
                className="w-full pl-9 pr-3 py-2 text-sm rounded-md border border-gray-300 dark:border-gray-700 bg-transparent"
              />
            </div>

            {[Sparkles, Mic, Zap, MessageSquare].map((Icon, i) => (
              <button
                key={i}
                className="p-2 rounded-md border border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900"
              >
                <Icon size={16} />
              </button>
            ))}

            <button className="p-2 rounded-md border border-gray-300 dark:border-gray-700">
              <Upload size={16} />
            </button>
          </div>
        </div>

        {/* Document List */}
        <div className="flex-1 overflow-y-auto px-4 py-3">
          <div className="max-w-5xl space-y-2">
            {documents.map((doc) => (
              <Link
                key={doc.id}
                href={`/documents/${doc.id}`}
                className="flex items-center gap-3 p-3 rounded-md border border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900"
              >
                <div className="w-9 h-9 flex items-center justify-center rounded-md border border-gray-200 dark:border-gray-800">
                  {doc.type === "문서" && <FileText size={16} />}
                  {doc.type === "음성" && <Mic size={16} />}
                  {doc.type === "비교" && <GitCompare size={16} />}
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{doc.title}</p>
                  <p className="text-xs text-gray-500 truncate">{doc.summary}</p>
                  <p className="text-xs text-gray-400">
                    {doc.date} {doc.time}
                  </p>
                </div>

                <span className="text-xs px-2 py-0.5 rounded border border-gray-300 dark:border-gray-700">
                  {doc.type}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </main>

      {/* ================= RIGHT CALENDAR ================= */}
      <aside className="w-80 border-l border-gray-200 dark:border-gray-800 p-4">
        <div className="flex justify-between mb-3">
          <h3 className="text-sm font-semibold">2025.12</h3>
          <div className="flex gap-1">
            <ChevronLeft size={16} />
            <ChevronRight size={16} />
          </div>
        </div>

        <div className="grid grid-cols-7 gap-1 mb-2 text-xs text-gray-500">
          {["일","월","화","수","목","금","토"].map(d => <div key={d} className="text-center">{d}</div>)}
        </div>

        <div className="grid grid-cols-7 gap-1 mb-4">
          {renderCalendar()}
        </div>

        <h4 className="text-xs font-semibold text-gray-500 mb-2">
          {selectedDate}일 일정
        </h4>

        <div className="space-y-2">
          {filteredSchedules.map((s, i) => (
            <div key={i} className="p-2 rounded-md border border-gray-200 dark:border-gray-800">
              <p className="text-xs font-medium">{s.title}</p>
              <p className="text-xs text-gray-500">{s.time}</p>
            </div>
          ))}
        </div>
      </aside>
    </div>
  );
}
