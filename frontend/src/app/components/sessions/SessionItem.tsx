"use client";

import { useRouter } from "next/navigation";
import { Folder } from "lucide-react";

type Props = {
    sessionId: number;
    title: string;
};

export default function SessionItem({ sessionId, title }: Props) {
    const router = useRouter();

    return (
        <div
            onClick={() => router.push(`/workspace/${sessionId}`)}
            className="
        flex items-center gap-2 px-3 py-2
        rounded-md cursor-pointer
        hover:bg-accent-soft
        text-sm
      "
        >
            <Folder size={16} className="text-text-muted-light" />
            <span className="truncate">{title}</span>
        </div>
    );
}
