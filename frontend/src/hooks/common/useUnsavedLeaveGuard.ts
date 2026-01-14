"use client";

import { useCallback, useEffect } from "react";


// 나중에 팔요하면 추가
export function useUnsavedLeaveGuard(
    hasUnsavedChanges: boolean,
    onSave?: () => Promise<void>
) {
    const shouldBlockNavigation = useCallback(() => {
        return hasUnsavedChanges;
    }, [hasUnsavedChanges]);

    const proceedWithSaveAndNavigate = useCallback(
        async (navigate: () => void) => {
            if (onSave) {
                await onSave();
            }
            navigate();
        },
        [onSave]
    );

    // 브라우저 새로고침 / 닫기 방어 (기본 경고)
    useEffect(() => {
        if (!hasUnsavedChanges) return;

        const handler = (e: BeforeUnloadEvent) => {
            e.preventDefault();
            e.returnValue = "";
        };

        window.addEventListener("beforeunload", handler);
        return () => window.removeEventListener("beforeunload", handler);
    }, [hasUnsavedChanges]);

    return {
        shouldBlockNavigation,
        proceedWithSaveAndNavigate,
    };
}
