// 경로: /src/components/chat/InputBar.tsx
// 입력창 + Enter/Send 버튼 처리

"use client";

import { useState } from "react";

interface Props {
  onSend: (text: string) => void;
}

export default function InputBar({ onSend }: Props) {
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim()) return;
    onSend(input);
    setInput("");
  };

  return (
    <div className="flex p-4 border-t border-neutral-200">
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") handleSend();
        }}
        placeholder="Message..."
        className="
          flex-1 border border-neutral-300 rounded-xl
          px-4 py-2 text-sm
          focus:outline-none focus:ring-2 focus:ring-blue-500
        "
      />

      <button
        className="
          ml-3 px-4 py-2 bg-blue-600 text-white
          rounded-xl text-sm hover:bg-blue-700 transition
        "
        onClick={handleSend}
      >
        Send
      </button>
    </div>
  );
}
