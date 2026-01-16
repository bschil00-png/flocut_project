"use client";

import { useRouter } from "next/navigation";
import Button from "@/app/components/ui/button/Button";

interface Props {
    role: "user" | "assistant";
    content: string;
    cta?: "workspace";
}

export default function MessageBubble({ role, content, cta }: Props) {
    const router = useRouter();
    const isUser = role === "user";

    return (
        <div
            className={`
        max-w-[75%]
        px-3 py-2 rounded-xl text-sm
        whitespace-pre-wrap break-words
        ${
                isUser
                    ? "ml-auto bg-accent text-white"
                    : "bg-surface-light dark:bg-surface-hover text-text-primary-light dark:text-text-primary-dark border border-border-light dark:border-border-dark"
            }
      `}
        >
            {content}

            {cta === "workspace" && (
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
