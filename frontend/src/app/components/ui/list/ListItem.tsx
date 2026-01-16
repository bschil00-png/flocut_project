"use client";

import React from "react";

export type ListItemProps = {
    title: string;
    description?: string;
    meta?: string;
    icon?: React.ReactNode;
    selected?: boolean;
} & Omit<
    React.HTMLAttributes<HTMLDivElement>,
    "children"
>;

export default function ListItem({
                                     title,
                                     description,
                                     meta,
                                     icon,
                                     selected = false,
                                     className = "",
                                     onClick,
                                     ...props
                                 }: ListItemProps) {
    return (
        <div
            tabIndex={0}
            role="button"
            aria-selected={selected}
            onClick={onClick}
            onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    onClick?.(e as any);
                }
            }}
            className={`
        flex items-start gap-3 px-3 py-2
        cursor-pointer rounded-md
        outline-none
        transition-colors

        text-text-primary-light dark:text-white

        hover:bg-accent-soft/60 dark:hover:bg-accent-soft/60
        ${selected ? "bg-accent-soft/60 dark:bg-accent-soft/60" : ""}

        focus-visible:ring-2 focus-visible:ring-accent

        ${className}
      `}
            {...props}
        >
            {icon && (
                <div className="mt-0.5 text-text-muted-light dark:text-white">
                    {icon}
                </div>
            )}

            <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">
                    {title}
                </p>

                {description && (
                    <p className="text-xs text-text-muted-light dark:text-text-muted-dark truncate">
                        {description}
                    </p>
                )}
            </div>

            {meta && (
                <span className="text-xs text-text-muted-light dark:text-text-muted-dark">
          {meta}
        </span>
            )}
        </div>
    );
}
