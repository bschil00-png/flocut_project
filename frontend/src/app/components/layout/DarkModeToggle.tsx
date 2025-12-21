"use client";

import { useTheme } from "next-themes";
import { Moon, Sun, Palette } from "lucide-react";
import { useEffect, useState } from "react";

type ColorTheme = "pink" | "blue" | "navy";

export default function DarkModeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [color, setColor] = useState<ColorTheme>("pink");

  useEffect(() => {
    setMounted(true);

    // 저장된 컬러 테마 복원
    const saved = localStorage.getItem("color-theme") as ColorTheme | null;
    if (saved && saved !== "pink") {
      document.documentElement.classList.add(`theme-${saved}`);
      setColor(saved);
    }
  }, []);

  if (!mounted) return null;

  const toggleColor = () => {
    const next: ColorTheme =
      color === "pink" ? "blue" : color === "blue" ? "navy" : "pink";

    // 기존 테마 제거
    document.documentElement.classList.remove("theme-blue", "theme-navy");

    // pink가 아닐 때만 클래스 추가
    if (next !== "pink") {
      document.documentElement.classList.add(`theme-${next}`);
    }

    localStorage.setItem("color-theme", next);
    setColor(next);
  };

  return (
    <div className="flex items-center gap-2">
      {/* 다크모드 */}
      <button
        onClick={() =>
          setTheme(resolvedTheme === "dark" ? "light" : "dark")
        }
        className="p-2 rounded-md hover:bg-surface-light dark:hover:bg-surface-dark"
        aria-label="toggle-dark-mode"
      >
        {resolvedTheme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
      </button>

      {/* 컬러 테마 */}
      <button
        onClick={toggleColor}
        className="p-2 rounded-md hover:bg-surface-light dark:hover:bg-surface-dark"
        title="컬러 테마 변경"
        aria-label="toggle-color-theme"
      >
        <Palette size={18} />
      </button>
    </div>
  );
}
