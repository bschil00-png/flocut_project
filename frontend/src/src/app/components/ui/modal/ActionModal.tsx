"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

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
  // SSR 대응을 위한 마운트 상태 관리
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

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

  // 모달이 닫혀있거나 클라이언트 마운트 전이면 아무것도 렌더링하지 않음
  if (!open || !mounted) return null;

  const sizes = {
    sm: "max-w-sm",
    md: "max-w-md",
  };

  // createPortal을 사용하여 document.body로 렌더링 위치를 이동
  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center px-4 overflow-hidden">
      {/* Backdrop: 배경을 어둡게 하고 클릭 시 닫힘 처리 */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm animate-fadeIn"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div
        role="dialog"
        aria-modal="true"
        className={`
                    relative w-full ${sizes[size]}
                    rounded-2xl
                    bg-background-light dark:bg-surface-dark
                    shadow-2xl
                    animate-scaleIn
                    z-[10000]
                `}
        onClick={(e) => e.stopPropagation()}
      >
        {/* header */}
        <div className="flex items-center justify-between px-6 py-5">
          {title && (
            <div className="flex items-center gap-2">
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
    </div>,
    document.body // 실제 렌더링 위치를 body로 강제 이동
  );
}