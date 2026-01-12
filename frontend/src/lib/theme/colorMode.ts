export type ColorMode = "light" | "dark" | "system";

export function applyColorMode(mode: ColorMode) {
    const root = document.documentElement;

    if (mode === "system") {
        const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
        root.classList.toggle("dark", isDark);
        localStorage.removeItem("color-mode");
        return;
    }

    root.classList.toggle("dark", mode === "dark");
    localStorage.setItem("color-mode", mode);
}

export function getStoredColorMode(): ColorMode {
    const stored = localStorage.getItem("color-mode");
    if (stored === "light" || stored === "dark") return stored;
    return "system";
}
