// src/app/components/settings/panels/AppearancePanel.tsx
"use client";

import { useTheme } from "next-themes";
import { useDispatch, useSelector } from "react-redux";
import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import Card from "@/app/components/ui/card/Card";
import Divider from "@/app/components/ui/divider/Divider";
import { setColorTheme, ColorTheme } from "@/store/slice/uislice";
import { RootState } from "@/store";

export default function AppearancePanel() {
    const { theme, setTheme } = useTheme();
    const dispatch = useDispatch();
    const colorTheme = useSelector((state: RootState) => state.ui.colorTheme);

    //  하이드레이션 에러 방지
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const colorThemes: { value: ColorTheme; label: string; class: string }[] = [
        { value: "pink", label: "핑크", class: "from-pink-500 to-violet-500" },
        { value: "blue", label: "블루", class: "from-blue-500 to-cyan-500" },
        { value: "navy", label: "네이비", class: "from-indigo-600 to-blue-600" },
    ];

    const handleColorThemeChange = (newTheme: ColorTheme) => {
        dispatch(setColorTheme(newTheme));

        document.documentElement.classList.remove("theme-pink", "theme-blue", "theme-navy");
        if (newTheme !== "pink") {
            document.documentElement.classList.add(`theme-${newTheme}`);
        }
    };

    //  마운트 전에는 로딩 표시
    if (!mounted) {
        return (
            <div className="max-w-2xl space-y-8">
                <div>
                    <h2 className="text-xl font-bold">테마 설정</h2>
                    <p className="text-sm text-text-muted-light dark:text-text-muted-dark mt-1">
                        로딩 중...
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-2xl space-y-8">
            <div>
                <h2 className="text-xl font-bold">테마 설정</h2>
                <p className="text-sm text-text-muted-light dark:text-text-muted-dark mt-1">
                    다크모드 및 컬러 테마를 선택합니다.
                </p>
            </div>

            <Divider />

            {/* 다크모드 */}
            <div>
                <h3 className="text-base font-semibold mb-4">다크모드</h3>
                <div className="grid grid-cols-2 gap-4">
                    {/* 라이트 모드 */}
                    <Card
                        interactive
                        padding="md"
                        variant={theme === "light" ? "default" : "outlined"}
                        onClick={() => {
                            console.log("라이트 모드 클릭");
                            setTheme("light");
                        }}
                        className={`
              cursor-pointer
              ${theme === "light" ? "ring-2 ring-accent" : ""}
            `}
                    >
                        <div className="flex flex-col items-center gap-3">
                            <Sun size={32} className="text-accent" />
                            <span className="font-medium">라이트</span>
                        </div>
                    </Card>

                    {/* 다크 모드 */}
                    <Card
                        interactive
                        padding="md"
                        variant={theme === "dark" ? "default" : "outlined"}
                        onClick={() => {
                            console.log("다크 모드 클릭");
                            setTheme("dark");
                        }}
                        className={`
              cursor-pointer
              ${theme === "dark" ? "ring-2 ring-accent" : ""}
            `}
                    >
                        <div className="flex flex-col items-center gap-3">
                            <Moon size={32} className="text-accent" />
                            <span className="font-medium">다크</span>
                        </div>
                    </Card>
                </div>
            </div>

            <Divider />

            {/* 컬러 테마 */}
            <div>
                <h3 className="text-base font-semibold mb-4">컬러 테마</h3>
                <div className="grid grid-cols-3 gap-4">
                    {colorThemes.map((ct) => (
                        <Card
                            key={ct.value}
                            interactive
                            padding="md"
                            variant={colorTheme === ct.value ? "default" : "outlined"}
                            onClick={() => {
                                console.log("컬러 테마 클릭:", ct.value);
                                handleColorThemeChange(ct.value);
                            }}
                            className={`
                cursor-pointer
                ${colorTheme === ct.value ? "ring-2 ring-accent" : ""}
              `}
                        >
                            <div className="flex flex-col items-center gap-3">
                                <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${ct.class}`} />
                                <span className="font-medium">{ct.label}</span>
                            </div>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
}