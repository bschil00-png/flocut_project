"use client";

import React from "react";

type Variant = "primary" | "secondary" | "ghost" | "oauth";
// xs 사이즈 명시적 추가
type Size = "xs" | "sm" | "md" | "lg";

export type ButtonProps = {
    variant?: Variant;
    size?: Size;
    loading?: boolean;
} & Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "children">;

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
    rounded-lg font-medium transition-all
    active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed
    whitespace-nowrap shrink-0
    whitespace-nowrap shrink-0
  `;

    const sizes = {
        xs: "h-7 px-2 text-[11px]",
        sm: "h-9 px-3 text-sm",
        md: "h-11 px-4 text-sm",
        lg: "h-12 px-6 text-base",
    };

    const variants = {
        primary: "bg-accent text-white hover:bg-accent-hover shadow-sm",
        secondary: "bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark text-text-primary-light dark:text-white hover:bg-accent-soft",
        ghost: "bg-transparent text-text-primary-light dark:text-white hover:bg-accent-soft",
        oauth: "bg-white text-gray-900 border border-gray-200 hover:bg-gray-50 dark:bg-gray-700",
    };

    return (
        <button
            type={type}
            disabled={disabled || loading}
            className={`${base} ${sizes[size]} ${variants[variant]} ${className}`}
            {...props}
        >
            {loading && (
                <span className="h-3 w-3 animate-spin rounded-full border-2 border-current border-t-transparent"/>
            )}
            <span className="flex items-center gap-2 pointer-events-none select-none">
        {children}
      </span>
        </button>
    );
}