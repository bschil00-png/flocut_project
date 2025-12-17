"use client";

import Button from "@/app/components/ui/button/Button";
import { Plus, Upload, Mic } from "lucide-react";
import { useRouter } from "next/navigation";

export default function NotesHeader({ total }: { total: number }) {
  const router = useRouter();

  const create = (type: "text" | "upload" | "audio") => {
    const id = Date.now();
    router.push(`/notes/${id}?type=${type}`);
  };

  return (
    <div className="
      border-b border-border-light dark:border-border-dark
      px-4 md:px-8 py-6
      flex flex-col md:flex-row
      md:items-center md:justify-between
      gap-4
    ">

      {/* 제목 영역 */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-text-primary-light dark:text-text-primary-dark">
          모든 노트
        </h1>
        <p className="text-sm text-text-muted-light dark:text-text-muted-dark">
          {total}개의 노트
        </p>
      </div>

      {/* 버튼 그룹 */}
      <div className="flex flex-wrap gap-2">
        <Button variant="primary" onClick={() => create("text")}>
          <Plus size={18} />
          새 노트
        </Button>
        <Button variant="secondary" onClick={() => create("upload")}>
          <Upload size={18} />
          문서 업로드
        </Button>
        <Button variant="secondary" onClick={() => create("audio")}>
          <Mic size={18} />
          음성 녹음
        </Button>
      </div>

    </div>
  );
}
