// components/layout/WorkspaceLayout/panel/PanelFooter.tsx
"use client";

type PanelFooterProps = {
  saved: boolean;
  saving?: boolean;
  charCount?: number;
  wordCount?: number;
};

export default function PanelFooter({
                                      saved,
                                      saving = false,
                                      charCount = 0,
                                      wordCount = 0,
                                    }: PanelFooterProps) {
  return (
    <div className="h-10 flex items-center justify-between px-4 text-xs border-t border-border-light dark:border-border-dark bg-white dark:bg-surface-dark text-text-muted-light dark:text-text-muted-dark">
      <div className="flex items-center gap-3">
        <span>{charCount.toLocaleString()}자</span>
        <span>•</span>
        <span className="hidden sm:inline">{wordCount.toLocaleString()}단어</span>
      </div>

      <div className="flex items-center gap-2">
        <div
          className={`w-2 h-2 rounded-full ${
            saving ? "bg-yellow-500 animate-pulse" : saved ? "bg-green-500" : "bg-red-500"
          }`}
        />
        <span className="hidden sm:inline">
          {saving ? "저장 중..." : saved ? "저장됨" : "저장 안됨"}
        </span>
      </div>
    </div>
  );
}