"use client";

import { useRouter } from "next/navigation";
import Button from "@/app/components/ui/button/Button";

interface Props {
    role: "user" | "assistant";
    content: string;
}

export default function MessageBubble({ role, content }: Props) {
    const router = useRouter();
    const isUser = role === "user";
    const showWorkspaceCTA =
        role === "assistant" && content.includes("워크스페이스");

    return (
        <div
            className={`
        max-w-[75%]
        px-3 py-2 rounded-xl text-sm whitespace-pre-wrap break-words
        ${
                isUser
                    ? "ml-auto bg-accent text-white"
                    : "bg-surface-light dark:bg-surface-dark text-text-primary-light dark:text-text-primary-dark"
            }
      `}
        >
            {content}

            {showWorkspaceCTA && (
                <div className="mt-2">
                    <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => router.push("/workspace")}
                    >
                        워크스페이스로 이동
                    </Button>
                </div>
            )}
        </div>
    );
}
