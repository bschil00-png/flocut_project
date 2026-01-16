"use client";

import { AnimatePresence, motion } from "framer-motion";
import Button from "@/app/components/ui/button/Button";

type AlertDialogProps = {
    open: boolean;
    title?: string;
    message: string;
    confirmText?: string;
    onClose: () => void;
    variant?: "info" | "success" | "error";
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
                <>
                    {/*<ModalOverlay onClose={onClose} />*/}

                    <div className="fixed inset-0 z-50 flex items-start justify-center pt-32 px-4">
                        <motion.div
                            initial={{ opacity: 0, y: -6 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -6 }}
                            transition={{ duration: 0.18, ease: "easeOut" }}
                            className="
                w-full max-w-md
                rounded-2xl
                bg-background-light dark:bg-surface-dark
                border border-border-light dark:border-border-dark
                shadow-xl
              "
                        >
                            <div className="p-6">
                                <h2 className="text-base font-semibold mb-3">{title}</h2>

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
                </>
            )}
        </AnimatePresence>
    );
}
