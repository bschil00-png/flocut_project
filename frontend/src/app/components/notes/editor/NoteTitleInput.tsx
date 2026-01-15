"use client";

import { useEffect, useRef } from "react";

interface NoteTitleInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

export default function NoteTitleInput({
                                         value,
                                         onChange,
                                         placeholder = "제목 없음",
                                         disabled = false,
                                       }: NoteTitleInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // 텍스트 길이에 맞춰 높이 자동 조절 (제목 잘림 해결)
  const adjustHeight = () => {
    const node = textareaRef.current;
    if (node) {
      node.style.height = "auto";
      node.style.height = `${node.scrollHeight}px`;
    }
  };

  useEffect(() => { adjustHeight(); }, [value]);

  return (
    <div className="w-full mb-10 border-b-2 border-accent/5 pb-4 focus-within:border-accent/20 transition-colors">
      <textarea
        ref={textareaRef}
        rows={1}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        className="
          w-full text-3xl sm:text-4xl lg:text-5xl font-extrabold
          bg-transparent border-none outline-none resize-none overflow-hidden
          text-text-primary-light dark:text-text-primary-dark
          placeholder:text-text-muted-light/20 leading-tight
        "
        style={{ height: "auto" }}
      />
    </div>
  );
}