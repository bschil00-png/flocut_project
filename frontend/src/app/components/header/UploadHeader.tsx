"use client";

import Button from "@/app/components/ui/button/Button";
import { Plus } from "lucide-react";
import { ReactNode } from "react";

type UploadHeaderProps = {
  title: string;
  total?: number;
  rightSlot?: ReactNode; // 업로드 버튼 등 주입용
};

export default function UploadHeader({
                                       title,
                                       total,
                                       rightSlot,
                                     }: UploadHeaderProps) {
  return (
    <div
      className="
        border-b border-border-light dark:border-border-dark
        px-4 md:px-8 py-6
        flex flex-col md:flex-row
        md:items-center md:justify-between
        gap-4
      "
    >
      {/* 제목 영역 */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold">
          {title}
        </h1>

        {typeof total === "number" && (
          <p className="text-sm text-text-muted-light dark:text-text-muted-dark">
            {total}개
          </p>
        )}
      </div>

      {/* 우측 슬롯 */}
      <div className="flex gap-2">
        {rightSlot}
      </div>
    </div>
  );
}
