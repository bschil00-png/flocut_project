"use client";

import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useCallback } from "react";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;

  width?: string; // max-w-2xl
  closeOnOverlay?: boolean;
}

export default function Modal({
                                open,
                                onClose,
                                title,
                                children,
                                footer,
                                width = "max-w-2xl",
                                closeOnOverlay = true,
                              }: ModalProps) {
  // ESC 닫기
  const handleEsc = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose]
  );

  useEffect(() => {
    if (open) document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [open, handleEsc]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          className="
            fixed inset-0 z-50 bg-black/50 backdrop-blur-sm
            flex items-center justify-center
          "
          onClick={() => closeOnOverlay && onClose()}
        >
          <motion.div
            key="modal"
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.22, type: "spring", stiffness: 220 }}
            className={`
              ${width}
              w-full max-h-[90vh]
              bg-background-light dark:bg-background-dark
              border border-border-light dark:border-border-dark
              rounded-2xl shadow-2xl overflow-hidden flex flex-col
            `}
            onClick={(e) => e.stopPropagation()}
          >
            {/* 헤더 */}
            <div className="flex items-center justify-between px-6 h-14 border-b border-border-light dark:border-border-dark">
              <h2 className="text-base font-semibold">{title}</h2>
              <button
                onClick={onClose}
                className="w-9 h-9 rounded-md hover:bg-surface-light dark:hover:bg-surface-hover"
              >
                <X size={18} />
              </button>
            </div>

            {/* 본문 */}
            <div className="flex-1 overflow-y-auto px-6 py-4">
              {children}
            </div>

            {/* 푸터 */}
            {footer && (
              <div className="px-6 py-4 border-t border-border-light dark:border-border-dark flex justify-end gap-2">
                {footer}
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
