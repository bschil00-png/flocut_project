"use client";

import React, { forwardRef } from "react";

type IconButtonVariant = "ghost" | "secondary" | "danger";
type IconButtonSize = "sm" | "md" | "lg";

export type IconButtonProps = {
    icon: React.ReactNode;
    variant?: IconButtonVariant;
    size?: IconButtonSize;
    loading?: boolean;
} & Omit<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    "children"
>;

const IconButton = forwardRef<
    HTMLButtonElement,
    IconButtonProps
>(function IconButton(
    {
        icon,
        variant = "ghost",
        size = "md",
        loading = false,
        disabled,
        type = "button",
        className = "",
        ...props
    },
    ref
) {
    const base = `
    inline-flex items-center justify-center
    rounded-md
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
        sm: "h-8 w-8",
        md: "h-9 w-9",
        lg: "h-10 w-10",
    };

    const variants = {
        ghost: `
      bg-transparent
      text-text-primary-light dark:text-text-primary-dark
      hover:bg-accent-soft
    `,
        secondary: `
      bg-surface-light dark:bg-surface-dark
      border border-border-light dark:border-border-dark
      text-text-primary-light dark:text-text-primary-dark
      hover:bg-accent-soft
    `,
        danger: `
      bg-transparent
      text-red-500
      hover:bg-red-50 dark:hover:bg-red-900/20
    `,
    };

    return (
        <button
            ref={ref}
            type={type}
            disabled={disabled || loading}
            aria-disabled={disabled || loading}
            aria-busy={loading}
            className={`
        ${base}
        ${sizes[size]}
        ${variants[variant]}
        ${className}
      `}
            {...props}
        >
            {loading ? (
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
            ) : (
                icon
            )}
        </button>
    );
});

export default IconButton;
