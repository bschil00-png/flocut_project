"use client";

import { useEffect, useRef } from "react";

interface AutoSaveData {
    title?: string;
    content?: string;
}

type SaveSource = "auto" | "manual" | "confirm";

export function useAutoSave(
    onSave: (data: AutoSaveData, source: SaveSource) => Promise<void>,
    data: AutoSaveData,
    delay = 2000,
    saveBlockRef?: React.MutableRefObject<boolean>
) {
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);
    const previousDataRef = useRef<AutoSaveData>(data);
    const isSavingRef = useRef(false);

    useEffect(() => {
        if (
            previousDataRef.current.title === data.title &&
            previousDataRef.current.content === data.content
        ) {
            return;
        }

        if (!data.title?.trim() && !data.content?.trim()) return;

        previousDataRef.current = data;

        if (timeoutRef.current) clearTimeout(timeoutRef.current);

        timeoutRef.current = setTimeout(() => {
            // saveBlockRef가 없거나 차단 중이면 저장 안 함
            if (saveBlockRef?.current) return;

            if (isSavingRef.current) return;

            isSavingRef.current = true;

            onSave(data, "auto")
                .catch((err) => console.error("자동 저장 실패", err))
                .finally(() => {
                    isSavingRef.current = false;
                });
        }, delay);

        return () => {
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
        };
    }, [data.title, data.content, delay, onSave, saveBlockRef]);
}
