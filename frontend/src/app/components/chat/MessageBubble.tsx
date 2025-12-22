"use client";

interface Props {
  role: "user" | "assistant" | "system";
  content: string;
}

export default function MessageBubble({ role, content }: Props) {
  const safeContent = content ?? "";
  const isUser = role === "user";

  const bubbleClass = [
    "max-w-[70%]",
    "p-3",
    "rounded-2xl",
    "text-sm",
    "leading-relaxed",
    "whitespace-pre-wrap",
    "break-words",
    isUser ? "ml-auto bg-blue-500 text-white" : "bg-neutral-100 text-neutral-900",
  ]
    .filter(Boolean)
    .join(" ");

  return <div className={bubbleClass}>{safeContent}</div>;
}
