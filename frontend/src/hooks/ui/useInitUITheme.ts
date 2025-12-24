"use client";

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import {ColorTheme, setColorTheme} from "@/store/slice/uislice";

const STORAGE_KEY = "color-theme";

export default function useInitUITheme() {
    const dispatch = useDispatch();

    useEffect(() => {
        // localStorage에서 저장된 컬러 테마 조회
        const savedTheme = localStorage.getItem(STORAGE_KEY) as ColorTheme | null;

        //  유효한 값만 처리
        const theme: ColorTheme =
            savedTheme === "blue" || savedTheme === "navy"
                ? savedTheme
                : "pink";

        //  Redux에 반영
        dispatch(setColorTheme(theme));

        //  기존 테마 클래스 제거
        document.documentElement.classList.remove(
            "theme-blue",
            "theme-navy"
        );

        // 5. pink가 아닐 경우에만 클래스 추가
        if (theme !== "pink") {
            document.documentElement.classList.add(`theme-${theme}`);
        }
    }, [dispatch]);
}
