// hooks/notes/useAutoSave.ts
"use client";

import { useEffect, useRef } from "react";

interface AutoSaveData {
    title?: string;
    content?: string;
}

export function useAutoSave(
    onSave: (data: AutoSaveData) => Promise<void>,
    data: AutoSaveData,
    delay = 2000
) {
    const timeoutRef = useRef<NodeJS.Timeout>();
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
            if (isSavingRef.current) return;

            isSavingRef.current = true;

            onSave(data)
                .catch((err) => console.error("자동 저장 실패", err))
                .finally(() => {
                    isSavingRef.current = false;
                });
        }, delay);

        return () => {
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
        };
    }, [data.title, data.content, delay, onSave]);
}
