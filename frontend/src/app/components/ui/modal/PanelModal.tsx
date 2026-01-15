"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import IconButton from "@/app/components/ui/icon-button/IconButton";
import { useRouter, useSearchParams } from "next/navigation";

type PanelModalProps = {
    children: React.ReactNode;
};

export default function PanelModal({ children }: PanelModalProps) {
    const [mounted, setMounted] = useState(false);
    const router = useRouter();
    const params = useSearchParams();

    const from = params.get("from");

    // SSR 환경에서 document를 참조하지 않도록 마운트 체크
    useEffect(() => {
        setMounted(true);
        // 모달 오픈 시 배경 스크롤 방지
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = "unset";
        };
    }, []);

    function handleClose() {
        if (from) {
            router.replace(from);
        } else {
            router.replace("/workspace");
        }
    }

    if (!mounted) return null;

    // 모달 컨텐츠 정의
    const modalJSX = (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-sm">
            <div
                className="
                    relative
                    w-full h-full
                    sm:w-[90vw] sm:h-[85vh]
                    max-w-6xl
                    bg-background-light dark:bg-surface-dark
                    rounded-none sm:rounded-xl
                    overflow-hidden
                    shadow-2xl
                "
            >
                {/* header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-border-light dark:border-border-dark bg-inherit">
                    <h2 className="text-m font-semibold">
                        설정
                    </h2>

                    <IconButton
                        icon={<X size={16} />}
                        onClick={handleClose}
                        aria-label="Close settings"
                    />
                </div>

                {/* content */}
                <div className="h-[calc(100%-56px)] overflow-y-auto">
                    {children}
                </div>
            </div>
        </div>
    );

    // body 태그 바로 아래에 렌더링
    return createPortal(modalJSX, document.body);
}