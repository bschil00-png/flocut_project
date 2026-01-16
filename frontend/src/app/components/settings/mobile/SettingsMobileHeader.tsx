"use client";

import { Menu, X } from "lucide-react";

export default function SettingsMobileHeader({
                                                 open,
                                                 onMenuClick,
                                                 onClose,
                                             }: {
    open: boolean;
    onMenuClick: () => void;
    onClose: () => void;
}) {
    return (
        <header className="h-14 px-4 flex items-center justify-between border-b border-border-light dark:border-border-dark">
            <button
                onClick={open ? onClose : onMenuClick}
                className="p-1"
            >
                {open ? <X size={20} /> : <Menu size={20} />}
            </button>

            <h1 className="text-sm font-semibold">설정</h1>

            <div className="w-6" />
        </header>
    );
}
