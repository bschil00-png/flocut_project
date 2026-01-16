// lib/theme/colorTheme.ts

export type ColorTheme = "pink" | "blue" | "navy";

const baseKey = "ui:color-theme";

function getStorageKey(memberId?: number) {
    return memberId ? `${baseKey}:${memberId}` : baseKey;
}

/** DOM + storage 적용 */
export function applyColorTheme(
    theme: ColorTheme,
    memberId?: number
) {
    const root = document.documentElement;

    root.classList.remove("theme-pink", "theme-blue", "theme-navy");

    if (theme !== "pink") {
        root.classList.add(`theme-${theme}`);
    }

    if (memberId) {
        localStorage.setItem(getStorageKey(memberId), theme);
    }
}

/** 로그인 유저 기준 테마 조회 */
export function getStoredColorTheme(
    memberId?: number
): ColorTheme {
    if (!memberId) return "pink";

    const stored = localStorage.getItem(getStorageKey(memberId));
    if (stored === "pink" || stored === "blue" || stored === "navy") {
        return stored;
    }

    return "pink";
}

/** 로그아웃 시 */
export function resetColorTheme() {
    const root = document.documentElement;
    root.classList.remove("theme-blue", "theme-navy");
}
