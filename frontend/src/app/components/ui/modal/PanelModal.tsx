"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import IconButton from "@/app/components/ui/icon-button/IconButton";
import { useRouter, useSearchParams } from "next/navigation";

export default function PanelModal({ children }: { children: React.ReactNode }) {
    const [mounted, setMounted] = useState(false);
    const router = useRouter();
    const params = useSearchParams();
    const from = params.get("from");

    useEffect(() => {
        setMounted(true);
        document.body.style.overflow = "hidden"; // 배경 스크롤 방지
        return () => { document.body.style.overflow = "unset"; };
    }, []);

    const handleClose = () => {
        router.replace(from || "/workspace");
    };

    if (!mounted) return null;

    return createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-sm">
            <div className="relative w-full h-full sm:w-[90vw] sm:h-[85vh] max-w-6xl bg-background-light dark:bg-surface-dark sm:rounded-xl overflow-hidden shadow-2xl">
                <div className="flex items-center justify-between px-6 py-4 border-b border-border-light dark:border-border-dark">
                    <h2 className="text-m font-semibold">설정</h2>
                    <IconButton icon={<X size={16} />} onClick={handleClose} />
                </div>
                <div className="h-[calc(100%-56px)] ">
                    {children}
                </div>
            </div>
        </div>,
        document.body
    );
}