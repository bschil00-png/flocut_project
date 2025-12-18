
"use client";

export default function EditorFooter({ content }: { content: string }) {
  return (
    <div className="h-12 px-6 border-t border-border-light dark:border-border-dark flex items-center justify-between text-xs text-text-muted-light dark:text-text-muted-dark">
      <span>{content.length} chars</span>
      <span>자동 저장됨</span>
    </div>
  );
}
