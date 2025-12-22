"use client";

type DividerProps = {
    className?: string;
};

export default function Divider({className = ""}: DividerProps) {
    return (
        <div
            role="separator"
            className={`
        w-full
        h-px
        bg-border-light
        dark:bg-border-dark
        ${className}
      `}
        />
    );
}