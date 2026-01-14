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
        w-full 
        text-2xl sm:text-3xl lg:text-4xl
        font-bold 
        bg-transparent 
        border-none 
        outline-none
        text-text-primary-light dark:text-text-primary-dark
        placeholder:text-text-muted-light dark:placeholder:text-text-muted-dark
        disabled:opacity-50 disabled:cursor-not-allowed
        overflow-visible
        ${className}
      `}
      style={{
        textOverflow: 'clip',
        whiteSpace: 'normal',
        wordBreak: 'break-word',
      }}
    />
  );
}