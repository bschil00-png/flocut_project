"use client";

import { useTheme } from "next-themes";
import { useDispatch, useSelector } from "react-redux";
import { Moon, Sun, Laptop } from "lucide-react";
import { useEffect, useState } from "react";

import Divider from "@/app/components/ui/divider/Divider";
import { setColorTheme, ColorTheme } from "@/store/slice/uislice";
import { RootState } from "@/store";
import { applyColorTheme } from "@/lib/theme/colorTheme";

export default function AppearancePanel() {
    const { theme, setTheme } = useTheme();
    const dispatch = useDispatch();
    const colorTheme = useSelector((state: RootState) => state.ui.colorTheme);

    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);

    const colorThemes: {
        value: ColorTheme;
        label: string;
        class: string;
    }[] = [
        { value: "pink", label: "핑크", class: "from-pink-500 to-violet-500" },
        { value: "blue", label: "블루", class: "from-blue-500 to-cyan-500" },
        { value: "navy", label: "네이비", class: "from-indigo-600 to-blue-700" },
    ];

    const handleColorThemeChange = (theme: ColorTheme) => {
        dispatch(setColorTheme(theme));
        applyColorTheme(theme);
    };

    if (!mounted) return null;

    return (
        <div className="max-w-2xl space-y-10">
            {/* 헤더 */}
            <div>
                <h2 className="text-xl font-bold">테마 설정</h2>
                <p className="text-sm text-text-muted-light dark:text-text-muted-dark mt-1">
                    화면 모드와 컬러 테마를 설정합니다.
                </p>
            </div>

            <Divider />

            {/* 다크모드 */}
            <section className="space-y-4">
                <h3 className="text-base font-semibold">화면 모드</h3>

                <div className="grid grid-cols-3 gap-3">
                    <ThemeOption
                        active={theme === "light"}
                        label="라이트"
                        icon={<Sun size={18} />}
                        onClick={() => setTheme("light")}
                    />
                    <ThemeOption
                        active={theme === "dark"}
                        label="다크"
                        icon={<Moon size={18} />}
                        onClick={() => setTheme("dark")}
                    />
                    <ThemeOption
                        active={theme === "system"}
                        label="시스템"
                        icon={<Laptop size={18} />}
                        onClick={() => setTheme("system")}
                    />
                </div>
            </section>

            <Divider />

            {/* 컬러 테마 */}
            <section className="space-y-4">
                <h3 className="text-base font-semibold">컬러 테마</h3>

                <div className="flex gap-6">
                    {colorThemes.map((ct) => {
                        const active = colorTheme === ct.value;

                        return (
                            <button
                                key={ct.value}
                                onClick={() => handleColorThemeChange(ct.value)}
                                className={`
                                    flex flex-col items-center gap-2
                                    transition
                                    ${active ? "scale-105" : "opacity-80 hover:opacity-100"}
                                `}
                            >
                                <div
                                    className={`
                                        w-14 h-14 rounded-full
                                        bg-gradient-to-br ${ct.class}
                                        ring-2
                                        ${active ? "ring-accent" : "ring-border-light dark:ring-border-dark"}
                                    `}
                                />
                                <span
                                    className={`text-sm font-medium ${
                                        active ? "text-accent" : "text-text-muted-light dark:text-text-muted-dark"
                                    }`}
                                >
                                    {ct.label}
                                </span>
                            </button>
                        );
                    })}
                </div>
            </section>
        </div>
    );
}

function ThemeOption({
                         active,
                         label,
                         icon,
                         onClick,
                     }: {
    active: boolean;
    label: string;
    icon: React.ReactNode;
    onClick: () => void;
}) {
    return (
        <button
            onClick={onClick}
            className={`
                h-14 rounded-xl
                border
                flex items-center justify-center gap-2
                text-sm font-medium
                transition
                ${
                active
                    ? "border-accent bg-accent-soft text-accent"
                    : "border-border-light dark:border-border-dark hover:bg-surface-light dark:hover:bg-surface-hover"
            }
            `}
        >
            {icon}
            {label}
        </button>
    );
}
