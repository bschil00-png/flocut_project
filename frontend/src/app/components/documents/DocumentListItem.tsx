"use client";

import { File } from "lucide-react";

interface FileData {
  fileId: number;
  fileName: string;
  fileType?: string | null;
  fileSize?: number | null;
  regdate?: string | null;
}

interface Props {
  file: FileData;
  sessionId: number;
}

export default function DocumentListItem({ file, sessionId }: Props) {
  return (
    <div className="group flex items-center gap-3 sm:gap-4 px-3 sm:px-4 py-2 sm:py-3 rounded-lg border border-slate-200 dark:border-slate-800 hover:border-pink-300 dark:hover:border-pink-800 hover:bg-pink-50 dark:hover:bg-pink-900/10 transition-all bg-white dark:bg-slate-900">
      <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 group-hover:bg-pink-100 dark:group-hover:bg-pink-900/20 transition-colors flex-shrink-0">
        <File size={18} className="text-blue-500" />
      </div>

      <div className="flex-1 min-w-0">
        <h3 className="font-medium text-sm sm:text-base text-slate-800 dark:text-slate-200 truncate mb-1">
          {file.fileName}
        </h3>
        <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
          <span>
            {file.regdate
              ? new Date(file.regdate).toLocaleDateString("ko-KR", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })
              : "방금 전"}
          </span>
          {file.fileSize && (
            <>
              <span>•</span>
              <span>{(file.fileSize / 1024).toFixed(2)} KB</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}