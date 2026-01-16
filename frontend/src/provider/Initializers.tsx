"use client";

import useInitUITheme from "@/hooks/ui/useInitUITheme";
import { useAuthRevalidation } from "@/hooks/useAuthRevalidation";
import { useProfileSync } from "@/hooks/member/useProfileSync";

// UI 테마 초기화
export function UIInitializer() {
    useInitUITheme();
    return null;
}

// 인증 상태 재검증
export function AuthRevalidator() {
    useAuthRevalidation();
    return null;
}

// 프로필 동기화
export function ProfileSyncInitializer() {
    useProfileSync();
    return null;
}