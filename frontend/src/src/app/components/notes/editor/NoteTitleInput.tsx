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

  const adjustHeight = () => {
    const node = textareaRef.current;
    if (node) {
      node.style.height = "auto";
      node.style.height = `${node.scrollHeight}px`;
    }
  };

  useEffect(() => { adjustHeight(); }, [value]);

  return (

    <div className="w-full mb-4 border-b border-accent/5 pb-1 focus-within:border-accent/20 transition-colors">
      <textarea
        ref={textareaRef}
        rows={1}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        className="
          w-full text-lg sm:text-xl lg:text-2xl font-bold
          bg-transparent border-none outline-none resize-none overflow-hidden
          text-text-primary-light dark:text-text-primary-dark
          placeholder:text-text-muted-light/30 leading-snug
        "
        style={{ height: "auto" }}
      />
    </div>
  );
}