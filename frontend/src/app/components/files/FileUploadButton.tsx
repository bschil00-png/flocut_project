// components/files/FileUploadButton.tsx
"use client";

import { useRef, useState } from "react";
import Button from "@/app/components/ui/button/Button";
import { Upload, Loader2 } from "lucide-react";
import { uploadFile } from "@/lib/rest/file/file.rest";
import { requestDocumentSummary } from "@/lib/rest/summary/summary.rest";
import { toast } from "sonner";
import AlertDialog from "@/app/components/ui/modal/AlertDialog";

type FileUploadButtonProps = {
    sessionId?: number;
    requestSummary?: boolean;
    onUploadComplete?: () => void;
    onSuccess?: () => void;
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
    const [uploadProgress, setUploadProgress] = useState<{
        current: number;
        total: number;
    } | null>(null);
    const [showErrorDialog, setShowErrorDialog] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const openPicker = () => {
        if (!loading) inputRef.current?.click();
    };

    const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (files.length === 0) return;

        setLoading(true);
        setUploadProgress({ current: 0, total: files.length });

        const results = {
            success: 0,
            failed: 0,
            errors: [] as string[],
        };

        for (let i = 0; i < files.length; i++) {
            const file = files[i];

            try {
                // 파일 크기 확인 (30MB 제한)
                if (file.size > 30 * 1024 * 1024) {
                    results.failed++;
                    results.errors.push(`${file.name}: 파일 크기 초과 (최대 30MB)`);
                    continue;
                }

                // 파일 타입 확인
                const extension = file.name.split(".").pop()?.toLowerCase();
                if (!["txt", "docx"].includes(extension || "")) {
                    results.failed++;
                    results.errors.push(
                        `${file.name}: 지원하지 않는 파일 형식 (.txt, .docx만 가능)`
                    );
                    continue;
                }

                const uploaded = await uploadFile(file, sessionId);
                results.success++;

                if (requestSummary && uploaded.sessionId) {
                    await requestDocumentSummary({
                        fileId: uploaded.fileId,
                        sessionId: uploaded.sessionId,
                    });
                }

                setUploadProgress({ current: i + 1, total: files.length });
            } catch (err) {
                console.error(err);
                results.failed++;
                results.errors.push(`${file.name}: 업로드 실패`);
            }
        }

        setLoading(false);
        setUploadProgress(null);
        e.target.value = "";

        // 결과 처리
        if (results.success > 0) {
            toast.success(
                `${results.success}개 파일 업로드 완료${
                    requestSummary ? " (요약 요청됨)" : ""
                }`
            );
            onUploadComplete?.();
            onSuccess?.();
        }

        if (results.failed > 0) {
            setErrorMessage(results.errors.join("\n"));
            setShowErrorDialog(true);
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
                className={
                    iconOnly ? "w-9 h-9 p-0 flex items-center justify-center" : ""
                }
            >
                {loading ? (
                    <Loader2 size={16} className="animate-spin" />
                ) : (
                    <Upload size={16} />
                )}
                {!iconOnly && (
                    <span className="ml-1">
            {loading
                ? uploadProgress
                    ? `${uploadProgress.current}/${uploadProgress.total}`
                    : "업로드 중..."
                : "문서 업로드"}
          </span>
                )}
            </Button>

            <input
                ref={inputRef}
                type="file"
                className="hidden"
                onChange={handleChange}
                accept=".txt,.docx"
                multiple
            />

            <AlertDialog
                open={showErrorDialog}
                title="업로드 오류"
                message={errorMessage}
                confirmText="확인"
                onClose={() => setShowErrorDialog(false)}
            />
        </>
    );
}