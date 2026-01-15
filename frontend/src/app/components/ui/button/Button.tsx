"use client";

import React, { forwardRef } from "react";

// 버튼의 스타일 변형 정의
type Variant = "primary" | "secondary" | "ghost" | "oauth" | "danger";
// 버튼의 크기 정의
type Size = "xs" | "sm" | "md" | "lg";

export type ButtonProps = {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
} & Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "children">;


const Button = forwardRef<HTMLButtonElement, React.PropsWithChildren<ButtonProps>>(
  (
    {
      children,
      variant = "primary",
      size = "md",
      loading = false,
      disabled,
      type = "button",
      className = "",
      ...props
    },
    ref
  ) => {
    // 공통 베이스 스타일
    const base = `
            inline-flex items-center justify-center gap-2
            rounded-lg font-medium transition-all
            active:scale-[0.98]
            disabled:opacity-50 disabled:cursor-not-allowed
            whitespace-nowrap shrink-0
        `;

    // 크기별 스타일 매핑
    const sizes = {
      xs: "h-7 px-2 text-[11px]",
      sm: "h-9 px-3 text-sm",
      md: "h-11 px-4 text-sm",
      lg: "h-12 px-6 text-base",
    };

    // 변형(Variant)별 스타일 매핑
    const variants = {
      primary:
        "bg-accent text-white hover:bg-accent-hover shadow-sm",
      secondary:
        "bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark text-text-primary-light dark:text-white hover:bg-accent-soft",
      ghost:
        "bg-transparent text-text-primary-light dark:text-white hover:bg-accent-soft",
      oauth:
        "bg-white text-gray-900 border border-gray-200 hover:bg-gray-50 dark:bg-gray-700",
      danger:
        "bg-red-600 text-white hover:bg-red-700 shadow-sm",
    };

    return (
      <button
        ref={ref} // 외부에서 전달된 ref를 실제 버튼 엘리먼트에 연결
        type={type}
        disabled={disabled || loading}
        className={`${base} ${sizes[size]} ${variants[variant]} ${className}`}
        {...props}
      >
        {/* 로딩 상태일 때 스피너 표시 */}
        {loading && (
          <span className="h-3 w-3 animate-spin rounded-full border-2 border-current border-t-transparent" />
        )}

        {/* 버튼 내부 텍스트 및 아이콘 영역 */}
        <span className="flex items-center gap-2 pointer-events-none select-none">
                    {children}
                </span>
      </button>
    );
  }
);

Button.displayName = "Button";

export default Button;