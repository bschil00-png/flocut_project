"use client";

import dynamic from "next/dynamic";
import TypingIndicator from "./TypingIndicator";
import {ChatMessage} from "@/store/slice/chatSlice";
//
// SSR 비활성화된 말풍선
const MessageBubble = dynamic(() => import("./MessageBubble"), {
  ssr: false,
});

interface Props {
  messages: ChatMessage[];
  bottomRef: React.RefObject<HTMLDivElement>;
  loading: boolean;
}

export default function ChatContainer({ messages, bottomRef, loading }: Props) {
  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-4">
      {messages.map((msg, index) => (
        <MessageBubble key={index} role={msg.role} content={msg.content} />
      ))}

      {loading && <TypingIndicator />}

      <div ref={bottomRef}></div>
    </div>
  );
}
