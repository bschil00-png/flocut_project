"use client";

import { X } from "lucide-react";
import IconButton from "@/app/components/ui/icon-button/IconButton";
import {useRouter, useSearchParams} from "next/navigation";

type PanelModalProps = {
    children: React.ReactNode;
};

export default function PanelModal({ children }: PanelModalProps) {
    const router = useRouter();
    const params = useSearchParams();

    const from = params.get("from");

    function handleClose() {
        if (from) {
            router.replace(from);
        } else {
            router.replace("/workspace");
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div
                className="
          relative
          w-full h-full
          sm:w-[90vw] sm:h-[85vh]
          max-w-6xl
          bg-background-light dark:bg-surface-dark
          rounded-none sm:rounded-xl
          overflow-hidden
        "
            >
                {/* header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-border-light dark:border-border-dark">
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
}
