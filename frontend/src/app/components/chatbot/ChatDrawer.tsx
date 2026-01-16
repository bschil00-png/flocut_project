"use client";

import { useDispatch, useSelector } from "react-redux";
import { closeChat } from "@/store/slice/uislice";
import { addMessage, clearChat } from "@/store/slice/publicChatSlice";
import { RootState } from "@/store";
import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";

import Card from "@/app/components/ui/card/Card";
import IconButton from "@/app/components/ui/icon-button/IconButton";
import ChatContainer from "./ChatContainer";
import InputBar from "./InputBar";

export default function ChatDrawer() {
  const dispatch = useDispatch();
  const { chatOpen } = useSelector((state: RootState) => state.ui);
  const { messages } = useSelector((state: RootState) => state.chat);

  const bottomRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (chatOpen) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, loading, chatOpen]);

  if (!chatOpen) return null;

  const sendMessage = async (text: string) => {
    if (!text.trim() || loading) return;
    dispatch(addMessage({ role: "user", content: text }));
    setLoading(true);
    try {
      const res = await fetch("/api/chat/public", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, { role: "user", content: text }],
        }),
      });
      const data = await res.json();
      dispatch(addMessage({
        role: "assistant",
        content: data.content,
        cta: data.content.includes("워크스페이스") ? "workspace" : undefined,
      }));
    } catch {
      dispatch(addMessage({
        role: "assistant",
        content: "현재 응답을 생성할 수 없어요. 잠시 후 다시 시도해 주세요.",
      }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card
      padding="none"
      className="
                fixed flex flex-col overflow-hidden
                /* z-index를 헤더(60)보다 높은 70으로 설정 */
                z-[70]

                /* 모바일: 헤더(h-16) 아래부터 시작하거나 전체를 덮도록 설정 */
                top-0 bottom-0 inset-x-0 w-full h-[100dvh]

                /* PC: 우측 하단 배치 */
                sm:top-auto sm:bottom-24 sm:right-6 sm:left-auto
                sm:w-[380px] sm:h-[600px] sm:max-h-[80vh]
                sm:rounded-2xl sm:shadow-2xl
            "
    >
      {/* Header: 모바일에서 시스템 상단 바 및 헤더와 겹침 방지 */}
      <div className="
                shrink-0 flex items-center justify-between px-4 py-3
                border-b border-border-light dark:border-border-dark
                bg-white dark:bg-surface-dark
                /* iOS Safe Area 대응 및 모바일 패딩 추가 */
                pt-[calc(env(safe-area-inset-top,0.5rem)+0.5rem)] sm:pt-3
            ">
                <span className="text-sm font-bold text-text-primary-light dark:text-text-primary-dark">
                    FloCut AI Assistant
                </span>

        <div className="flex items-center gap-2">
          <button
            onClick={() => dispatch(clearChat())}
            className="text-xs text-text-muted-light hover:underline px-2"
          >
            초기화
          </button>
          <IconButton
            icon={<X size={20} />}
            onClick={() => dispatch(closeChat())}
          />
        </div>
      </div>

      {/* Chat scroll area */}
      <div className="flex-1 overflow-y-auto bg-gray-50 dark:bg-background-dark">
        <ChatContainer
          messages={messages}
          bottomRef={bottomRef}
          loading={loading}
        />
      </div>

      {/* Input area: 키보드 대응 패딩 */}
      <div className="shrink-0 border-t border-border-light dark:border-border-dark bg-white dark:bg-surface-dark pb-[env(safe-area-inset-bottom,1rem)]">
        <InputBar onSend={sendMessage} disabled={loading} />
      </div>
    </Card>
  );
}