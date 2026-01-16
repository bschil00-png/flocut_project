"use client";

import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

export function useWorkspaceRouting() {
    const router = useRouter();
    const params = useParams<{ sessionId: string }>();
    const searchParams = useSearchParams();

    const selectedId = searchParams.get("id");
    const selectedType = searchParams.get("type") as
        | "note"
        | "document"
        | "audio"
        | null;

    const openItem = useCallback(
        (type: string, id: number | string) => {
            router.push(
                `/workspace/${params.sessionId}?type=${type}&id=${id}`,
                { scroll: false }
            );
        },
        [router, params.sessionId]
    );

    const openNewNote = useCallback(() => {
        openItem("note", "new");
    }, [openItem]);

    const closePanel = useCallback(() => {
        router.push(`/workspace/${params.sessionId}`, { scroll: false });
    }, [router, params.sessionId]);

    return {
        selectedId,
        selectedType,
        openItem,
        openNewNote,
        closePanel,
    };
}