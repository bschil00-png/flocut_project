// src/components/notes/header/HeaderActions.tsx
"use client";

import { X, Save, Maximize2, ArrowLeft } from "lucide-react";
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
    isMobile?: boolean;
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
                                          isMobile = false,
                                      }: Props) {
    const router = useRouter();

    return (
        <div className="flex items-center gap-2">
            {/* 다운로드 버튼 (항상 표시) */}
            <DownloadButton
                title={title}
                content={content}
                htmlContent={htmlContent}
            />

            {/*  전체 화면 버튼 (항상 표시) */}
            {type === "note" && noteId && (
                <IconButton
                    icon={<Maximize2 size={16} />}
                    onClick={() => router.push(`/workspace/${sessionId}/notes/${noteId}`)}
                    aria-label="전체 화면"
                />
            )}

            {/*  저장 버튼 (항상 표시) */}
            {type === "note" && (
                <Button
                    size="sm"
                    variant={saved ? "secondary" : "primary"}
                    loading={saving}
                    disabled={saved}
                    onClick={onSave}
                >
                    <Save size={14} />
                    {/* 모바일에서는 텍스트만 숨김 */}
                    {!isMobile && (saved ? "저장됨" : "저장")}
                </Button>
            )}

            {/*  모바일: 뒤로가기 / 데스크톱: 닫기 */}
            <IconButton
                icon={isMobile ? <ArrowLeft size={16} /> : <X size={16} />}
                onClick={onClose}
                aria-label={isMobile ? "뒤로가기" : "닫기"}
            />
        </div>
    );
}