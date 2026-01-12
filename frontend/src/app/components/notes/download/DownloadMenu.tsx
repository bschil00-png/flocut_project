"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { DownloadFormat, DownloadData, DOWNLOAD_OPTIONS } from "./types";
import { downloadFile } from "./downloadUtils";
import { toast } from "sonner";

type Props = {
    data: DownloadData;
    onClose: () => void;
};

export default function DownloadMenu({ data, onClose }: Props) {
    const [loading, setLoading] = useState<DownloadFormat | null>(null);

    const handleDownload = async (format: DownloadFormat) => {
        setLoading(format);
        try {
            await downloadFile(format, data);
            toast.success(`${format.toUpperCase()} 다운로드 완료`);
        } catch (error) {
            console.error("다운로드 실패:", error);
            toast.error("다운로드 실패");
        } finally {
            setLoading(null);
            onClose();
        }
    };

    return (
        <div className="
      absolute top-full right-0 mt-2 w-48
      rounded-lg border border-border-light dark:border-border-dark
      bg-white dark:bg-surface-dark
      shadow-lg overflow-hidden
      z-50
      animate-scaleIn
    ">
            <div className="p-2 space-y-1">
                {DOWNLOAD_OPTIONS.map((option) => (
                    <DownloadMenuItem
                        key={option.format}
                        label={option.label}
                        description={option.description}
                        loading={loading === option.format}
                        disabled={loading !== null}
                        onClick={() => handleDownload(option.format)}
                    />
                ))}
            </div>
        </div>
    );
}

function DownloadMenuItem({
                              label,
                              description,
                              loading,
                              disabled,
                              onClick,
                          }: {
    label: string;
    description: string;
    loading: boolean;
    disabled: boolean;
    onClick: () => void;
}) {
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className="
        w-full flex items-center gap-2 px-3 py-2 rounded-md
        text-left transition-colors
        hover:bg-accent-soft
        disabled:opacity-50 disabled:cursor-not-allowed
      "
        >
            {loading && (
                <Loader2 size={14} className="animate-spin text-accent flex-shrink-0" />
            )}

            <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-text-primary-light dark:text-text-primary-dark truncate">
                    {label}
                </div>
                <div className="text-xs text-text-muted-light dark:text-text-muted-dark truncate">
                    {description}
                </div>
            </div>
        </button>
    );
}