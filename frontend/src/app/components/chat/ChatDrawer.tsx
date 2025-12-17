"use client";

import { useDispatch, useSelector } from "react-redux";
import { closeChat } from "@/store/slice/uislice";

import ChatContainer from "./ChatContainer";
import InputBar from "./InputBar";

import {
  addMessage,
  updateLastAssistantMessage,
  setSummary,
  clearChat,
} from "@/store/slice/chatSlice";

import { useRef, useEffect, useState } from "react";
import {RootState} from "@/store";

/**
 * 하단 고정 챗봇 패널
 * - Notion 스타일
 * - position: fixed
 */
export default function ChatDrawer() {
  const dispatch = useDispatch();
  const { chatOpen } = useSelector((state: RootState) => state.ui);
  const { messages, summary, characterMode } = useSelector(
    (state: RootState) => state.chat
  );

  const bottomRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (!chatOpen) return null;

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;

    dispatch(addMessage({ role: "user", content: text }));
    setLoading(true);

    const res = await fetch("/api/chat", {
      method: "POST",
      body: JSON.stringify({
        messages: [...messages, { role: "user", content: text }],
        summary,
        characterMode,
      }),
    });

    const reader = res.body?.getReader();
    const decoder = new TextDecoder();
    let aiText = "";

    dispatch(addMessage({ role: "assistant", content: "" }));

    while (true) {
      const { value, done } = await reader!.read();
      if (done) break;
      aiText += decoder.decode(value);
      dispatch(updateLastAssistantMessage(aiText));
    }

    setLoading(false);
  };

  return (
    <div
      className="
        fixed bottom-24 right-6 z-50
        w-[380px] h-[520px]
        bg-white
        border border-border-light
        rounded-xl
        shadow-xl
        flex flex-col
      "
    >
      {/* Header */}
      <div className="p-4 border-b flex justify-between items-center">
        <span className="font-semibold">AI Assistant</span>
        <button
          onClick={() => dispatch(closeChat())}
          className="text-sm text-neutral-500"
        >
          닫기
        </button>
      </div>

      {/* Chat */}
      <ChatContainer
        messages={messages}
        bottomRef={bottomRef}
        loading={loading}
      />

      {/* Input */}
      <InputBar onSend={sendMessage} />
    </div>
  );
}
