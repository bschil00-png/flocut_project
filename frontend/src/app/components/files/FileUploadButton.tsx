"use client";

import { useRef, useState } from "react";
import Button from "@/app/components/ui/button/Button";
import { Upload } from "lucide-react";
import { uploadFile } from "@/lib/rest/file/file.rest";
import { toast } from "sonner";

type FileUploadButtonProps = {
  onSuccess?: () => void;
};

export default function FileUploadButton({
                                           onSuccess,
                                         }: FileUploadButtonProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [loading, setLoading] = useState(false);

  const openPicker = () => {
    if (loading) return;
    inputRef.current?.click();
  };

  const handleChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);

    try {
      await uploadFile(file);
      toast.success("문서 업로드 완료");

      // GraphQL 재조회용
      onSuccess?.();
    } catch (err) {
      console.error(err);
      toast.error("문서 업로드 실패");
    } finally {
      setLoading(false);
      e.target.value = "";
    }
  };

  return (
    <>
      <Button
        variant="secondary"
        onClick={openPicker}
        disabled={loading}
      >
        <Upload size={18} />
        {loading ? "업로드 중..." : "문서 업로드"}
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
