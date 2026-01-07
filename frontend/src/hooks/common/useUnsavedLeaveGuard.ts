"use client";

import { useCallback, useEffect } from "react";

type UseUnsavedLeaveGuardParams = {
    hasUnsavedChanges: boolean;
    onSave?: () => Promise<void>;
};


// 저장되지 않은 변경사항이 있을 때
// - 라우터 이동 시: 커스텀 confirm 처리
// - 브라우저 종료 시: beforeunload + sendBeacon

export function useUnsavedLeaveGuard(
    hasUnsavedChanges: boolean,
    onSave?: () => Promise<void>
) {
    /**
     * 라우터 이동이나 패널 닫기 전에 호출하는 함수
     */
    const confirmNavigation = useCallback(
        async (navigate: () => void) => {
            // 변경사항 없으면 바로 이동
            if (!hasUnsavedChanges) {
                navigate();
                return;
            }

            // 사용자 확인
            const ok = window.confirm(
                "저장되지 않은 변경사항이 있습니다.\n저장하고 이동하시겠습니까?"
            );

            if (!ok) return;

            // 저장 로직이 있다면 먼저 실행
            if (onSave) {
                await onSave();
            }

            // 실제 이동
            navigate();
        },
        [hasUnsavedChanges, onSave]
    );

    /**
     * 브라우저 닫기 / 새로고침 보호
     * (커스텀 UI 불가, 브라우저 기본 경고 사용)
     */
    useEffect(() => {
        if (!hasUnsavedChanges) return;

        const handler = (e: BeforeUnloadEvent) => {
            e.preventDefault();
            e.returnValue = "";
        };

        window.addEventListener("beforeunload", handler);
        return () => window.removeEventListener("beforeunload", handler);
    }, [hasUnsavedChanges]);

    return { confirmNavigation };
}