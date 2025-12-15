// 경로: /src/components/chat/TypingIndicator.tsx
// AI가 타이핑 중일 때 보여주는 UI

"use client";

export default function TypingIndicator() {
  return (
    <div className="flex items-center space-x-2">
      <div className="flex space-x-1">
        <span className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce" />
        <span className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce delay-100" />
        <span className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce delay-200" />
      </div>
      <span className="text-neutral-500 text-sm">Typing...</span>
    </div>
  );
}
