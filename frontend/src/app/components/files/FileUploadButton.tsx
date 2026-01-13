"use client";

import { useRef, useState } from "react";
import Button from "@/app/components/ui/button/Button";
import { Upload } from "lucide-react";
import { uploadFile } from "@/lib/rest/file/file.rest";
import { requestDocumentSummary } from "@/lib/rest/summary/summary.rest";
import { toast } from "sonner";

type FileUploadButtonProps = {
    sessionId?: number;
    requestSummary?: boolean;
    onUploadComplete?: () => void;
    onSuccess?: () => void;

    /** 아이콘만 표시 (반응형용) */
    iconOnly?: boolean;
};

export default function FileUploadButton({
                                             sessionId,
                                             requestSummary = false,
                                             onUploadComplete,
                                             onSuccess,
                                             iconOnly = false,
                                         }: FileUploadButtonProps) {
    const inputRef = useRef<HTMLInputElement | null>(null);
    const [loading, setLoading] = useState(false);

    const openPicker = () => {
        if (!loading) inputRef.current?.click();
    };

    const handleChange = async (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setLoading(true);

        try {
            // 파일 업로드
            const uploaded = await uploadFile(file, sessionId);
            toast.success("문서 업로드 완료");

            // 업로드 완료 콜백
            onUploadComplete?.();

            // 요약 요청
            if (requestSummary && uploaded.sessionId) {
                await requestDocumentSummary({
                    fileId: uploaded.fileId,
                    sessionId: uploaded.sessionId,
                });
                toast.success("AI 요약 요청이 접수되었습니다.");
            }

            onSuccess?.();
        } catch (err) {
            console.error(err);
            toast.error("업로드 또는 요약 요청 실패");
        } finally {
            setLoading(false);
            e.target.value = "";
        }
    };

    return (
        <>
            <Button
                variant="secondary"
                size="sm"
                onClick={openPicker}
                disabled={loading}
                aria-label="문서 업로드"
                title="문서 업로드"
                className={iconOnly ? "w-9 h-9 p-0 flex items-center justify-center" : ""}
            >
            <Upload size={16} />
                {!iconOnly && (
                    <span className="ml-1">
            {loading ? "업로드 중..." : "문서 업로드"}
          </span>
                )}
            </Button>

            <input
                ref={inputRef}
                type="file"
                className="hidden"
                onChange={handleChange}
                accept=".pdf,.docx,.txt"
            />
        </>
    );
}
