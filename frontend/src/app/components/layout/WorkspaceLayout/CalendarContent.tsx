"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";

//  나중에 노트 아이디랑 연결
interface CalendarContentProps {
  noteId: string;
}

export default function CalendarContent({
                                          noteId,
                                        }: CalendarContentProps) {
  const [currentDate, setCurrentDate] = useState(new Date(2025, 11, 1));
  const [selectedDate, setSelectedDate] = useState<number | null>(null);

  //  임시 노트 일정 데이터
  const notesInMonth = [
    { id: "1", date: 10, title: "FloCut 기획 정리" },
    { id: "2", date: 15, title: "AI 요약 구조 정리" },
    { id: "3", date: 20, title: "프로젝트 회고" },
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

  const prevMonth = () =>
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
    );

  const nextMonth = () =>
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
    );

  const notesOfSelectedDate = notesInMonth.filter(
    (n) => n.date === selectedDate
  );

  return (
    <div className="p-4">
      {/* 헤더 */}
      <div className="flex items-center justify-between mb-4">
        <button onClick={prevMonth}>
          <ChevronLeft size={16} />
        </button>
        <h3 className="text-sm font-semibold">
          {currentDate.getFullYear()}년 {currentDate.getMonth() + 1}월
        </h3>
        <button onClick={nextMonth}>
          <ChevronRight size={16} />
        </button>
      </div>

      {/* 날짜 그리드 */}
      <div className="grid grid-cols-7 gap-1 text-center text-sm">
        {Array.from({ length: firstDayOfMonth }).map((_, i) => (
          <div key={`empty-${i}`} />
        ))}

        {Array.from({ length: daysInMonth }, (_, i) => {
          const day = i + 1;
          const hasNote = notesInMonth.some((n) => n.date === day);

          return (
            <button
              key={day}
              onClick={() => setSelectedDate(day)}
              className={`relative py-2 rounded ${
                selectedDate === day
                  ? "bg-accent text-white"
                  : "hover:bg-surface-hover"
              }`}
            >
              {day}
              {hasNote && (
                <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-accent" />
              )}
            </button>
          );
        })}
      </div>

      {/* 선택된 날짜의 노트 */}
      <div className="mt-6">
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-xs font-semibold text-text-muted-light">
            {selectedDate
              ? `${selectedDate}일의 노트`
              : "날짜를 선택하세요"}
          </h4>
          <button className="p-1 bg-accent text-white rounded">
            <Plus size={12} />
          </button>
        </div>

        {notesOfSelectedDate.length > 0 ? (
          <div className="space-y-2">
            {notesOfSelectedDate.map((note) => (
              <div
                key={note.id}
                className="p-2 border rounded text-sm"
              >
                {note.title}
              </div>
            ))}
          </div>
        ) : (
          selectedDate && (
            <p className="text-xs text-text-muted-light">
              해당 날짜에 노트가 없습니다.
            </p>
          )
        )}
      </div>
    </div>
  );
}
