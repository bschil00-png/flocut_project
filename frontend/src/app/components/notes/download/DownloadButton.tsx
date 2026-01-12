// src/components/notes/header/DownloadButton.tsx
"use client";

import { useState, useRef, useEffect } from "react";
import { Download } from "lucide-react";
import IconButton from "@/app/components/ui/icon-button/IconButton";
import DownloadMenu from "../download/DownloadMenu";
import { DownloadData } from "../download/types";

type Props = {
    title: string;
    content: string;
    htmlContent?: string;
};

export default function DownloadButton({ title, content, htmlContent }: Props) {
    const [showMenu, setShowMenu] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
                setShowMenu(false);
            }
        };

        if (showMenu) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [showMenu]);

    const downloadData: DownloadData = {
        title: title || "제목 없음",
        content: content || "",
        htmlContent,
    };

    return (
        <div className="relative" ref={menuRef}>
            <IconButton
                icon={<Download size={16} />}
                onClick={() => setShowMenu(!showMenu)}
                aria-label="다운로드"
            />

            {showMenu && (
                <DownloadMenu
                    data={downloadData}
                    onClose={() => setShowMenu(false)}
                />
            )}
        </div>
    );
}