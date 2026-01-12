// src/components/notes/header/HeaderActions.tsx
"use client";

import { X, Save, Maximize2 } from "lucide-react";
import { useRouter } from "next/navigation";
import Button from "@/app/components/ui/button/Button";
import IconButton from "@/app/components/ui/icon-button/IconButton";
import DownloadButton from "@/app/components/notes/download/DownloadButton";

type Props = {
    type: "note" | "document" | "audio";
    sessionId: number;
    noteId?: number;
    saved: boolean;
    saving: boolean;
    onSave: () => void;
    onClose: () => void;
    title: string;
    content: string;
    htmlContent?: string;
};

export default function HeaderActions({
                                          type,
                                          sessionId,
                                          noteId,
                                          saved,
                                          saving,
                                          onSave,
                                          onClose,
                                          title,
                                          content,
                                          htmlContent,
                                      }: Props) {
    const router = useRouter();

    return (
        <div className="flex items-center gap-2">
            {/*  htmlContent 전달 */}
            <DownloadButton
                title={title}
                content={content}
                htmlContent={htmlContent}
            />

            {type === "note" && noteId && (
                <IconButton
                    icon={<Maximize2 size={16} />}
                    onClick={() => router.push(`/workspace/${sessionId}/notes/${noteId}`)}
                    aria-label="전체 화면"
                />
            )}

            {type === "note" && (
                <Button
                    size="sm"
                    variant={saved ? "secondary" : "primary"}
                    loading={saving}
                    disabled={saved}
                    onClick={onSave}
                >
                    <Save size={14} />
                    {saved ? "저장됨" : "저장"}
                </Button>
            )}

            <IconButton icon={<X size={16} />} onClick={onClose} aria-label="닫기" />
        </div>
    );
}