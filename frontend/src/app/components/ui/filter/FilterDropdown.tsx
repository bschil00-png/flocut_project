"use client";

import { ChevronDown, Check } from "lucide-react";
import { useState, useRef, useEffect } from "react";

//   드롭다운 옵션 타입
type Option = {
  value: string;
  label: string;
  icon?: React.ReactNode;
};

type Props = {
  label: string; // 드롭다운 제목 (예: "정렬")
  value: string; // 현재 선택된 값
  options: Option[]; // 선택 가능한 옵션들
  onChange: (value: string) => void; // 값 변경 시 콜백
  className?: string;
};

export default function FilterDropdown({
                                         label,
                                         value,
                                         options,
                                         onChange,
                                         className = "",
                                       }: Props) {
  // 드롭다운 열림/닫힘 상태
  const [open, setOpen] = useState(false);

  // 바깥 클릭 감지용 ref
  const ref = useRef<HTMLDivElement>(null);

  // 현재 선택된 옵션 찾기
  const selected = options.find((o) => o.value === value);

   //  드롭다운 바깥 클릭 시 닫기
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={ref} className={`relative ${className}`}>
      {/* 드롭다운 트리거 버튼 */}
      <button
        onClick={() => setOpen(!open)}
        className="
          flex items-center gap-2 h-9 px-3
          rounded-lg border border-border-light dark:border-border-dark
          bg-white dark:bg-surface-dark
          hover:bg-surface-light dark:hover:bg-surface-hover
          hover:border-accent
          transition-all duration-200
          text-sm
        "
      >
        {/* 레이블 (회색 작은 글씨) */}
        <span className="text-text-muted-light dark:text-text-muted-dark text-xs">
          {label}
        </span>

        {/* 현재 선택된 값 */}
        <span className="font-medium text-text-primary-light dark:text-text-primary-dark">
          {selected?.label}
        </span>

        {/* 화살표 아이콘 (열리면 180도 회전) */}
        <ChevronDown
          size={14}
          className={`text-text-muted-light dark:text-text-muted-dark transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* 드롭다운 메뉴 (열렸을 때만 표시) */}
      {open && (
        <div className="
          absolute top-full left-0 mt-2 w-48
          rounded-lg border border-border-light dark:border-border-dark
          bg-white dark:bg-surface-dark
          shadow-lg overflow-hidden
          z-50
          animate-scaleIn
        ">
          {options.map((option) => {
            const isSelected = value === option.value;

            return (
              <button
                key={option.value}
                onClick={() => {
                  onChange(option.value);
                  setOpen(false);
                }}
                className={`
                  w-full flex items-center justify-between gap-2
                  px-3 py-2 text-sm text-left
                  transition-colors duration-150
                  ${
                  isSelected
                    ? "bg-accent-soft text-accent font-medium"
                    : "text-text-primary-light dark:text-text-primary-dark hover:bg-surface-light dark:hover:bg-surface-hover"
                }
                `}
              >
                {/* 옵션 아이콘 + 텍스트 */}
                <div className="flex items-center gap-2">
                  {option.icon}
                  <span>{option.label}</span>
                </div>

                {/* 선택된 옵션에만 체크 표시 */}
                {isSelected && <Check size={14} />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}