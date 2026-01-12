"use client";

import { motion, AnimatePresence } from "framer-motion";
import Button from "@/app/components/ui/button/Button";

type AlertDialogProps = {
    open: boolean;
    title?: string;
    message: string;
    confirmText?: string;
    onClose: () => void;
};

export default function AlertDialog({
                                        open,
                                        title = "알림",
                                        message,
                                        confirmText = "확인",
                                        onClose,
                                    }: AlertDialogProps) {
    return (
        <AnimatePresence>
            {open && (
                <div className="fixed inset-0 z-50 flex items-start justify-center pt-32 px-4">
                    <motion.div
                        role="alert"
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.18, ease: "easeOut" }}
                        className="
                            w-full
                            max-w-md
                            rounded-xl
                            border
                            border-border-light dark:border-border-dark
                            bg-white dark:bg-surface-dark
                            shadow-lg
                        "
                    >
                        <div className="p-6">
                            <h2 className="text-base font-semibold mb-3">
                                {title}
                            </h2>

                            <p className="text-sm text-text-muted-light dark:text-text-muted-dark mb-6">
                                {message}
                            </p>

                            <div className="flex justify-end">
                                <Button size="sm" onClick={onClose}>
                                    {confirmText}
                                </Button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}