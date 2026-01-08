"use client";

import { useEffect } from "react";
import { X } from "lucide-react";
import IconButton from "@/app/components/ui/icon-button/IconButton";

type ModalSize = "md" | "lg" | "xl";

type ModalProps = {
    open: boolean;
    onCloseAction: () => void;
    title?: string;
    children: React.ReactNode;
    size?: ModalSize;
    className?: string;
};

export default function Modal({
                                  open,
                                  onCloseAction,
                                  title,
                                  children,
                                  size = "lg",
                                  className = "",
                              }: ModalProps) {
    useEffect(() => {
        if (!open) return;

        const handleKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") onCloseAction();
        };

        window.addEventListener("keydown", handleKey);
        return () => window.removeEventListener("keydown", handleKey);
    }, [open, onCloseAction]);

    if (!open) return null;

    const sizes = {
        md: "max-w-2xl",
        lg: "max-w-3xl",
        xl: "max-w-5xl",
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* overlay */}
            <div
                className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                onClick={onCloseAction}
            />

            {/* modal */}
            <div
                role="dialog"
                aria-modal="true"
                aria-labelledby={title ? "modal-title" : undefined}
                className={`
          relative
          w-full
          mx-0 sm:mx-4
          ${sizes[size]}
          h-full sm:h-auto
          sm:max-h-[85vh]
          overflow-hidden
          rounded-none sm:rounded-xl

          bg-background-light
          dark:bg-surface-dark
          border border-border-light dark:border-border-dark

          animate-scaleIn
          ${className}
        `}
                onClick={(e) => e.stopPropagation()}
            >
                {/* header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-border-light dark:border-border-dark">
                    {title && (
                        <h2
                            id="modal-title"
                            className="text-sm font-semibold text-text-primary-light dark:text-white"
                        >
                            {title}
                        </h2>
                    )}

                    <IconButton
                        icon={<X size={16} />}
                        onClick={onCloseAction}
                        aria-label="Close modal"
                    />
                </div>

                {/* content */}
                <div className="px-6 py-4 overflow-y-auto">
                    {children}
                </div>
            </div>
        </div>
    );
}
