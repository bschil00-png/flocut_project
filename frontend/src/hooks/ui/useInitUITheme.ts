"use client";

import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import { setColorTheme } from "@/store/slice/uislice";
import {
  applyColorTheme,
  getStoredColorTheme,
} from "@/lib/theme/colorTheme";

export default function useInitUITheme() {
  const dispatch = useDispatch();
  const initialized = useRef(false);

  const { status, user } = useSelector(
    (state: RootState) => state.auth
  );

  useEffect(() => {
    // 최초 1회만 실행
    if (initialized.current) return;

    // 인증 확인 중에는 아무 것도 하지 않음
    if (status === "checking") return;

    initialized.current = true;

    // 비로그인 상태 → 기본 테마
    if (status !== "authenticated" || !user) {
      dispatch(setColorTheme("pink"));
      applyColorTheme("pink");
      return;
    }

    // 로그인 상태 → 유저 기준 테마 복구
    const theme = getStoredColorTheme(user.memberId);
    dispatch(setColorTheme(theme));
    applyColorTheme(theme, user.memberId);
  }, [dispatch, status, user]);
}
