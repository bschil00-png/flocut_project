import { ColorTheme } from "@/store/slice/uislice";

const THEME_CLASSES = ["theme-pink", "theme-blue", "theme-navy"];

export function applyColorTheme(theme: ColorTheme) {
    const root = document.documentElement;

    // 기존 테마 제거
    THEME_CLASSES.forEach((cls) => root.classList.remove(cls));

    // 기본(pink)은 class 없음
    if (theme !== "pink") {
        root.classList.add(`theme-${theme}`);
    }
}
