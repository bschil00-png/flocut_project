"use client";

import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Button from "@/app/components/ui/button/Button";

type ConfirmDialogProps = {
    open: boolean;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    onConfirm: () => void;
    onClose: () => void;
    confirmVariant?: "primary" | "danger";
};

export default function ConfirmDialog({
                                          open,
                                          title,
                                          message,
                                          confirmText = "확인",
                                          cancelText = "취소",
                                          confirmVariant = "primary",
                                          onConfirm,
                                          onClose,
                                      }: ConfirmDialogProps) {
    // ESC 닫기
    useEffect(() => {
        if (!open) return;

        const handleKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };

        window.addEventListener("keydown", handleKey);
        return () => window.removeEventListener("keydown", handleKey);
    }, [open, onClose]);

    return (
        <AnimatePresence>
            {open && (
                <>
                    {/*<ModalOverlay onClose={onClose} />*/}

                    <div className="fixed inset-0 z-50 flex items-start justify-center pt-28 px-4">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.96 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.96 }}
                            transition={{ duration: 0.18, ease: "easeOut" }}
                            className="
                w-full max-w-sm
                rounded-2xl
                bg-background-light dark:bg-surface-dark
                border border-border-light dark:border-border-dark
                shadow-2xl
              "
                        >
                            <div className="p-6">
                                <h2 className="text-base font-bold mb-3">{title}</h2>

                                <p className="text-sm text-text-muted-light dark:text-text-muted-dark">
                                    {message}
                                </p>

                                <div className="mt-6 flex justify-end gap-2">
                                    <Button
                                        variant="secondary"
                                        size="sm"
                                        onClick={onClose}
                                    >
                                        {cancelText}
                                    </Button>

                                    <Button
                                        size="sm"
                                        className="bg-red-500 hover:bg-red-600 text-white"
                                        onClick={onConfirm}
                                    >
                                        {confirmText}
                                    </Button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>
    );
}
