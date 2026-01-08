"use client";

import { useEffect } from "react";
import { X } from "lucide-react";
import IconButton from "@/app/components/ui/icon-button/IconButton";
import ModalOverlay from "./ModalOverlay";

type ModalSize = "sm" | "md";

type ActionModalProps = {
    open: boolean;
    onClose: () => void;
    title?: string;
    children: React.ReactNode;
    size?: ModalSize;
};

export default function ActionModal({
                                        open,
                                        onClose,
                                        title,
                                        children,
                                        size = "md",
                                    }: ActionModalProps) {

    // ESC + body scroll lock
    useEffect(() => {
        if (!open) return;

        const originalOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";

        const handleKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                onClose();
            }
        };

        window.addEventListener("keydown", handleKey);

        return () => {
            document.body.style.overflow = originalOverflow;
            window.removeEventListener("keydown", handleKey);
        };
    }, [open, onClose]);

    if (!open) return null;

    const sizes = {
        sm: "max-w-sm",
        md: "max-w-md",
    };

    return (
        <>
            {/*<ModalOverlay onClose={onClose} />*/}

            <div className="fixed inset-0 z-50 flex items-center justify-center px-4 animate-fadeIn">
                <div
                    role="dialog"
                    aria-modal="true"
                    className={`
                        w-full ${sizes[size]}
                        rounded-2xl
                        bg-background-light dark:bg-surface-dark
                        shadow-2xl
                        animate-scaleIn
                    `}
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* header: border-b 제거 및 배경 포인트 */}
                    <div className="flex items-center justify-between px-6 py-5">
                        {title && (
                            <div className="flex items-center gap-2">
                                {/* 타이틀 옆에 accent 포인트 (선택 사항) */}
                                <div className="w-1 h-4 bg-accent rounded-full" />
                                <h2 className="text-base font-bold text-text-primary-light dark:text-text-primary-dark">
                                    {title}
                                </h2>
                            </div>
                        )}
                        <button
                            onClick={onClose}
                            className="p-1.5 rounded-lg text-text-muted-light hover:bg-accent-soft hover:text-accent transition-colors"
                            aria-label="닫기"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    {/* content */}
                    <div className="px-6 pb-6">
                        <div className="text-sm text-text-primary-light dark:text-text-primary-dark">
                            {children}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}