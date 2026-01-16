"use client";

import { ChatMessage } from "@/store/slice/publicChatSlice";
import EmptyState from "@/app/components/ui/empty-state/EmptyState";
import TypingIndicator from "./TypingIndicator";
import MessageBubble from "./MessageBubble";
import { MessageCircle } from "lucide-react";

interface Props {
    messages: ChatMessage[];
    bottomRef: React.RefObject<HTMLDivElement>;
    loading: boolean;
}

export default function ChatContainer({
                                          messages,
                                          bottomRef,
                                          loading,
                                      }: Props) {
    return (
        <div className="px-4 py-3 space-y-3">
            {messages.length === 0 && !loading && (
                <EmptyState
                    icon={<MessageCircle size={24} />}
                    title="FLOCUT AI 도우미"
                    description="문서·음성 요약 사용법 안내와 짧은 텍스트 요약을 체험해보세요."
                />
            )}

            {messages.map((msg, idx) => (
                <MessageBubble
                    key={idx}
                    role={msg.role}
                    content={msg.content}
                    cta={msg.cta}
                />
            ))}

            {loading && <TypingIndicator />}

            <div ref={bottomRef} />
        </div>
    );
}
