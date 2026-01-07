"use client";

import {Search, X} from "lucide-react";
import {useState, useEffect} from "react";

type Props = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  debounce?: number; // 디바운스 시간 (ms)
  className?: string;
};

export default function SearchInput({
                                      value,
                                      onChange,
                                      placeholder = "검색...",
                                      debounce = 300,
                                      className = "",
                                    }: Props) {

  // 로컬 입력값 (실시간 타이핑용)사용자가 타이핑하는 동안은 localValue만 업데이트

  const [localValue, setLocalValue] = useState(value);


  //  디바운스 효과
  //  사용자가 타이핑을 멈춘 후 300ms 뒤에 실제 검색 실행
  // 타이핑 중에는 매번 API 호출하지 않음 (성능 최적화)

  useEffect(() => {
    const timer = setTimeout(() => {
      onChange(localValue);
    }, debounce);

    // 새로운 타이핑이 들어오면 이전 타이머 취소
    return () => clearTimeout(timer);
  }, [localValue, debounce, onChange]);


    // 외부에서 value가 변경되면 localValue도 동기화
    // (예: 검색 초기화 버튼 클릭 시)

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  return (
    <div className={`relative ${className}`}>
      {/* 검색 아이콘 (왼쪽) */}
      <Search
        size={16}
        className="
          absolute left-3 top-1/2 -translate-y-1/2
          text-text-muted-light dark:text-text-muted-dark
          pointer-events-none
        "
      />

      {/* 검색 입력창 */}
      <input
        type="text"
        value={localValue}
        onChange={(e) => setLocalValue(e.target.value)}
        placeholder={placeholder}
        className="
          w-full h-9 pl-9 pr-9
          rounded-lg border border-border-light dark:border-border-dark
          bg-white dark:bg-surface-dark
          text-sm text-text-primary-light dark:text-text-primary-dark
          placeholder:text-text-muted-light dark:placeholder:text-text-muted-dark
          focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent
          transition-all duration-200
        "
      />

      {/* 입력값 지우기 버튼 (값이 있을 때만 표시) */}
      {localValue && (
        <button
          onClick={() => {
            setLocalValue("");
            onChange("");
          }}
          className="
            absolute right-2 top-1/2 -translate-y-1/2
            p-1 rounded hover:bg-surface-light dark:hover:bg-surface-hover
            text-text-muted-light dark:text-text-muted-dark
            transition-colors duration-150
          "
        >
          <X size={14}/>
        </button>
      )}
    </div>
  );
}