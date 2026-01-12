// src/app/components/layout/WorkspaceLayout/workspace/WorkspacePanel.tsx
"use client";

import { useParams } from "next/navigation";
import UnifiedPanel from "@/app/components/layout/WorkspaceLayout/workspace/panel/UnifiedPanel";

type UpdatedPayload = {
    noteId: number;
    title: string;
    moddate: string;
};

type Props = {
    selectedId: string | null;
    selectedType: "note" | "document" | "audio" | null;
    onClose: () => void;
    onUpdated: (payload: UpdatedPayload) => void;
};

export default function WorkspacePanel({ selectedId, selectedType, onClose, onUpdated }: Props) {
    const { sessionId } = useParams<{ sessionId: string }>();

    if (!selectedId || !selectedType) return null;

    const handleUpdated = (payload: UpdatedPayload) => {
        console.log(" [WorkspacePanel] UnifiedPanel 데이터를 Page로 전달:", payload);
        onUpdated(payload);
    };

    return (
        <UnifiedPanel
            type={selectedType}
            id={selectedId}
            sessionId={Number(sessionId)}
            onClose={onClose}
            onUpdated={handleUpdated}
        />
    );
}