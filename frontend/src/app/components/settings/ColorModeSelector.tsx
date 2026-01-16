"use client";

import { useEffect, useState } from "react";
import { applyColorMode, getStoredColorMode, ColorMode } from "@/lib/theme/colorMode";
import { Sun, Moon, Laptop } from "lucide-react";

type Option = {
    value: ColorMode;
    label: string;
    icon: React.ReactNode;
};

const OPTIONS: Option[] = [
    { value: "light", label: "라이트", icon: <Sun size={18} /> },
    { value: "dark", label: "다크", icon: <Moon size={18} /> },
    { value: "system", label: "시스템", icon: <Laptop size={18} /> },
];

type Props = {
    onChanged?: () => void;
};

export default function ColorModeSelector({ onChanged }: Props) {
    const [mode, setMode] = useState<ColorMode>("system");

    useEffect(() => {
        setMode(getStoredColorMode());
    }, []);

    const handleSelect = (value: ColorMode) => {
        setMode(value);
        applyColorMode(value);
        onChanged?.();
    };

    return (
        <div className="grid grid-cols-3 gap-3">
            {OPTIONS.map((opt) => (
                <button
                    key={opt.value}
                    onClick={() => handleSelect(opt.value)}
                    className={`
                        flex flex-col items-center gap-2
                        rounded-lg border p-4
                        transition-colors
                        ${
                        mode === opt.value
                            ? "border-accent bg-accent-soft"
                            : "border-border-light dark:border-border-dark hover:border-accent/50"
                    }
                    `}
                >
                    <div className="text-text-primary-light dark:text-text-primary-dark">
                        {opt.icon}
                    </div>
                    <span className="text-sm font-medium">
                        {opt.label}
                    </span>
                </button>
            ))}
        </div>
    );
}
