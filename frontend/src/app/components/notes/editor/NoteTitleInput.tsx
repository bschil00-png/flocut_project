"use client";

interface NoteTitleInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

export default function NoteTitleInput({
                                         value,
                                         onChange,
                                         placeholder = "제목 없음",
                                         disabled = false,
                                         className = "",
                                       }: NoteTitleInputProps) {
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      disabled={disabled}
      className={`
        w-full text-3xl font-bold bg-transparent border-none outline-none mb-4
        text-text-primary-light dark:text-text-primary-dark
        placeholder:text-text-muted-light dark:placeholder:text-text-muted-dark
        disabled:opacity-50 disabled:cursor-not-allowed
        ${className}
      `}
    />
  );
}