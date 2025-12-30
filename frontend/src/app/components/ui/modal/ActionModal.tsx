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
    useEffect(() => {
        if (!open) return;

        const handleKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };

        window.addEventListener("keydown", handleKey);
        return () => window.removeEventListener("keydown", handleKey);
    }, [open, onClose]);

    if (!open) return null;

    const sizes = {
        sm: "max-w-sm",
        md: "max-w-md",
    };

    return (
        <>
            <ModalOverlay onClose={onClose} />

            <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
                <div
                    role="dialog"
                    aria-modal="true"
                    className={`
            w-full ${sizes[size]}
            rounded-xl
            bg-background-light dark:bg-surface-dark
            border border-border-light dark:border-border-dark
            shadow-lg
          `}
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* header */}
                    {title && (
                        <div className="flex items-center justify-between px-5 py-4 border-b border-border-light dark:border-border-dark">
                          <h2 className="text-sm font-semibold">{title}</h2>
                          <IconButton icon={<X size={16} />} onClick={onClose} />
                        </div>
                    )}

                    {/* content */}
                    <div className="px-5 py-4 space-y-4">
                        {children}
                    </div>
                </div>
            </div>
        </>
    );
}
