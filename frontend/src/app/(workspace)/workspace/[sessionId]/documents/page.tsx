"use client";

import { useRouter } from "next/navigation";
import { useMyFiles } from "@/hooks/files/useMyFiles";
import UploadHeader from "@/app/components/header/UploadHeader";
import FileUploadButton from "@/app/components/files/FileUploadButton";

export default function DocumentsPage() {
  const router = useRouter();
  const { files, loading, refetch } = useMyFiles();

  const openDetail = (fileId: number) => {
    router.push(`/documents/${fileId}`);
  };

  return (
    <div>
      <UploadHeader
        title="문서"
        total={files.length}
        rightSlot={<FileUploadButton onSuccess={refetch} />}
      />

      <div className="px-8 py-6">
        {loading && <p>불러오는 중...</p>}

        <ul className="space-y-2">
          {files.map((file) => (
            <li
              key={file.fileId}
              onClick={() => openDetail(file.fileId)}
              className="
                border p-3 rounded cursor-pointer
                hover:bg-gray-50 dark:hover:bg-gray-900
              "
            >
              {file.fileName}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
