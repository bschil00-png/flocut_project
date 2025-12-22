"use client"

import React from "react";

type FormProps = {
        // children이 없으면 의미 없기에 일부러 ? 사용하지 않음
        children: React.ReactNode;
        loading?: boolean;
        onSubmit?: (e: React.FormEvent<HTMLFormElement>) => void;
        className?: string;
    } & Omit<
    React.FormHTMLAttributes<HTMLFormElement>,
    "onSubmit" | "children"
>;

export default function Form({
                                 children,
                                 loading = false,
                                 className = "",
                                 onSubmit,
                                 ...props
                             }: FormProps) {
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        if (loading) {
            // 로딭 중일때는 submit 차단
            e.preventDefault();
            return;
        }
        onSubmit?.(e);
    };

    return (
        <form
            {...props}
            onSubmit={handleSubmit}
            className={`
        space-y-4
        ${className}
      `}
        >
            {children}
        </form>
    );
}