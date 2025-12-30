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
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    if (!chatOpen) return null;

    const sendMessage = async (text: string) => {
        if (!text.trim() || loading) return;

        dispatch(addMessage({ role: "user", content: text }));
        setLoading(true);

        try {
            const res = await fetch("/api/chat/public", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    messages: [...messages, { role: "user", content: text }],
                }),
            });

            const data = await res.json();

            dispatch(
                addMessage({
                    role: "assistant",
                    content: data.content,
                    cta: data.content.includes("워크스페이스") ? "workspace" : undefined,
                })
            );
        } catch {
            dispatch(
                addMessage({
                    role: "assistant",
                    content:
                        "현재 응답을 생성할 수 없어요. 잠시 후 다시 시도해 주세요.",
                })
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card
            padding="none"
            className="
    fixed z-50 flex flex-col
    bottom-0 right-0
    w-full h-[100dvh]

    sm:bottom-24 sm:right-6
    sm:w-[380px] sm:h-[520px]
  "
        >
            {/* Header */}
            <div className="shrink-0 flex items-center justify-between px-4 py-3 border-b border-border-light dark:border-border-dark">
                <span className="text-sm font-semibold">FloCut AI Assistant</span>

                <div className="flex items-center gap-2">
                    <button
                        onClick={() => dispatch(clearChat())}
                        className="text-xs text-text-muted-light hover:underline"
                    >
                        초기화
                    </button>

                    <IconButton
                        icon={<X size={16} />}
                        onClick={() => dispatch(closeChat())}
                    />
                </div>
            </div>

            {/* Chat (스크롤 영역) */}
            <div className="flex-1 overflow-y-auto">
                <ChatContainer
                    messages={messages}
                    bottomRef={bottomRef}
                    loading={loading}
                />
            </div>

            {/* Input (항상 하단 고정) */}
            <div className="shrink-0 border-t border-border-light dark:border-border-dark">
                <InputBar onSend={sendMessage} disabled={loading} />
            </div>
        </Card>
    );
}
