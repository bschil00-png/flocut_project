"use client";

import { useEffect } from "react";
import Button from "@/app/components/ui/button/Button";
import ModalOverlay from "./ModalOverlay";

type ConfirmDialogProps = {
    open: boolean;
    title?: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    onConfirm?: () => void;
    onClose: () => void;
};

export default function ConfirmDialog({
                                          open,
                                          title = "",
                                          message,
                                          confirmText = "확인",
                                          cancelText,
                                          onConfirm,
                                          onClose,
                                      }: ConfirmDialogProps) {

    const handleConfirm = () => {
        onConfirm?.();
        onClose();
    };

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

    return (
        <>
            {/*<ModalOverlay onClose={onClose} />*/}

            <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
                <div
                    role="dialog"
                    aria-modal="true"
                    className="
                        w-full max-w-sm
                        rounded-2xl
                        bg-background-light dark:bg-surface-dark
                        shadow-2xl
                        animate-scaleIn
                    "
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="px-6 py-5">
                        <h2 className="text-base font-bold mb-3">
                            {title}
                        </h2>

                        <p className="text-sm text-text-primary-light dark:text-text-primary-dark leading-relaxed">
                            {message}
                        </p>

                        <div className="mt-6 flex justify-end gap-2">
                            {cancelText && (
                                <Button
                                    variant="secondary"
                                    size="sm"
                                    onClick={onClose}
                                >
                                    {cancelText}
                                </Button>
                            )}
                            <Button
                                size="sm"
                                onClick={handleConfirm}
                            >
                                {confirmText}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
