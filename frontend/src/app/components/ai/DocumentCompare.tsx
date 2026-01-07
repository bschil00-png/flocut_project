// src/app/components/ai/DocumentCompare.tsx
"use client";

import IconButton from "@/app/components/ui/icon-button/IconButton";
import Button from "@/app/components/ui/button/Button";
import { X, GitCompare } from "lucide-react";
import { useState } from "react";

interface DocumentCompareProps {
  currentContent: string;
  onClose: () => void;
}

export default function DocumentCompare({
                                          currentContent,
                                          onClose
                                        }: DocumentCompareProps) {
  const [selected, setSelected] = useState("old1");

  return (
    <div
      className="
                fixed inset-0 flex items-center justify-center
                bg-black/30 backdrop-blur-sm z-[999]
            "
    >
      <div
        className="
                    w-[720px] rounded-xl overflow-hidden
                    bg-surface-light dark:bg-surface-dark
                    border border-border-light dark:border-border-dark
                    shadow-xl
                "
      >
        {/* Header */}
        <div className="h-14 px-4 flex items-center justify-between border-b border-border-light dark:border-border-dark">
          <div className="flex items-center gap-2">
            <GitCompare size={18} className="text-accent" />
            <h2 className="text-sm font-semibold">문서 비교</h2>
          </div>
          <IconButton icon={<X size={16} />} onClick={onClose} />
        </div>

        {/* Body */}
        <div className="p-4 space-y-6 max-h-[70vh] overflow-y-auto">

          {/* Select target */}
          <div className="space-y-2">
            <label className="text-xs text-text-muted-light dark:text-text-muted-dark">
              비교할 문서 선택
            </label>
            <select
              className="
                                w-full px-3 py-2 rounded-lg
                                border border-border-light dark:border-border-dark
                                bg-background-light dark:bg-background-dark
                                text-sm
                            "
              value={selected}
              onChange={(e) => setSelected(e.target.value)}
            >
              <option value="old1">이전 버전 #1</option>
              <option value="old2">이전 버전 #2</option>
              <option value="old3">이전 버전 #3</option>
            </select>
          </div>

          {/* Diff result */}
          <div className="space-y-4">
            <div className="p-3 rounded border border-red-300 bg-red-50 dark:bg-red-900/20">
              <p className="text-xs text-red-600 dark:text-red-300">
                - 삭제된 내용 예시
              </p>
            </div>

            <div className="p-3 rounded border border-green-300 bg-green-50 dark:bg-green-900/20">
              <p className="text-xs text-green-600 dark:text-green-300">
                + 추가된 내용 예시
              </p>
            </div>

            <div className="p-3 rounded border border-blue-300 bg-blue-50 dark:bg-blue-900/20">
              <p className="text-xs text-blue-600 dark:text-blue-300">
                ~ 수정된 내용 예시
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-border-light dark:border-border-dark">
          <Button variant="primary" className="w-full">
            상세 비교 보기
          </Button>
        </div>
      </div>
    </div>
  );
}
