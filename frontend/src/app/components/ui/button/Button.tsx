"use client";

import React from "react";

type Variant = "primary" | "secondary" | "ghost" | "oauth";
type Size = "sm" | "md" | "lg";

export type ButtonProps = {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
} & Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  "children"
>;
// type = "button", 명시적으로 해둔 이유는 기본적으로 폼을 건드리지 않는다라는 안전 장치로 해둠
// ...props← 여기로 표준 button props 전부 들어온다
export default function Button({
                                 children,
                                 variant = "primary",
                                 size = "md",
                                 loading = false,
                                 disabled,
                                 type = "button",
                                 className = "",
                                 ...props
                               }: React.PropsWithChildren<ButtonProps>) {
  const base = `
    inline-flex items-center justify-center gap-2
    rounded-md
    font-medium
    transition-colors
    focus:outline-none
    focus-visible:ring-2 focus-visible:ring-accent
    focus-visible:ring-offset-2
    focus-visible:ring-offset-background-light
    dark:focus-visible:ring-offset-background-dark
    disabled:opacity-50
    disabled:cursor-not-allowed
  `;

  const sizes = {
    sm: "h-9 px-3 text-sm",
    md: "h-11 px-4 text-sm",
    lg: "h-12 px-6 text-base",
  };

  const variants = {
    primary: `
      bg-accent
      text-white
      hover:bg-accent-hover
      active:scale-[0.98]
      active:bg-accent-hover
      shadow-sm
    `,

    secondary: `
      bg-surface-light
      dark:bg-surface-dark
      border border-border-light dark:border-border-dark

      text-text-primary-light
      dark:text-white

      hover:bg-accent-soft
      dark:hover:bg-accent-soft
    `,

    ghost: `
      bg-transparent
      text-text-primary-light dark:text-white
      hover:bg-accent-soft dark:hover:bg-accent-soft
    `,

    oauth: `
      bg-white
      text-gray-900
      border border-gray-200
      hover:bg-gray-50
      dark:bg-gray-700
      dark:text-gray-100
      dark:border-gray-600
      dark:hover:bg-gray-600
    `,
  };

  return (
    <button
      type={type}
      disabled={disabled || loading}
      aria-busy={loading}
      aria-disabled={disabled || loading}
      className={`
        ${base}
        ${sizes[size]}
        ${variants[variant]}
        ${className}
      `}
      {...props}
    >
      {loading && (
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"/>
      )}

      <span className="flex items-center gap-2 pointer-events-none select-none">
        {children}
      </span>
    </button>
  );
}
