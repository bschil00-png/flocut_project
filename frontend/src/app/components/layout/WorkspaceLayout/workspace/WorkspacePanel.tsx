"use client";

import { useParams } from "next/navigation";
import UnifiedPanel from "@/app/components/layout/WorkspaceLayout/workspace/panel/UnifiedPanel";
import { useMediaQuery } from "@/hooks/common/useMediaQuery";

type UpdatedPayload = {
    noteId: number;
    title: string;
    moddate: string;
};

type Props = {
    selectedId: string | null;
    selectedType: "note" | "document" | "audio" | null;
    selectedFileName?: string;
    onClose: () => void;
    onCreated?: (noteId: number) => void;
    onUpdated: () => void;
};

export default function WorkspacePanel({
                                           selectedId,
                                           selectedType,
                                           selectedFileName,
                                           onClose,
                                           onCreated,
                                           onUpdated,
                                       }: Props) {
    const { sessionId } = useParams<{ sessionId: string }>();

    const isMobile = useMediaQuery("(max-width: 768px)");
    const isTablet = useMediaQuery("(max-width: 1024px)");

    if (!selectedId || !selectedType) return null;

    return (
        <UnifiedPanel
            type={selectedType}
            id={selectedId}
            sessionId={Number(sessionId)}
            fileName={selectedFileName}
            onClose={onClose}
            onCreated={onCreated}
            onUpdated={onUpdated}
            isMobile={isMobile || isTablet}
        />
    );
}