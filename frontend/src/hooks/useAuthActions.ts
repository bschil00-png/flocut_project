"use client";

import { useDispatch, useSelector } from "react-redux";
import {
  setAuthUser,
  clearAuth,
  startAuthCheck,
} from "@/store/slice/authSlice";
import { getMeByGraphQL } from "@/lib/graphql/auth/auth.client";
import * as authRest from "@/lib/rest/auth/auth.rest";
import { useCallback, useRef } from "react";
import { setAvatarId, setColorTheme } from "@/store/slice/uislice";
import {
  applyColorTheme,
  getStoredColorTheme,
  resetColorTheme,
} from "@/lib/theme/colorTheme";
import { RootState } from "@/store";

export function useAuthActions() {
  const dispatch = useDispatch();
  const authStatus = useSelector((state: RootState) => state.auth.status);

  // ensureAuth 동시 실행 방지용 (실제 락)
  const ensureAuthInFlightRef = useRef(false);

  // 로그인된 유저 기준 컬러 테마 적용
  const applyUserTheme = (memberId: number) => {
    const theme = getStoredColorTheme(memberId);
    dispatch(setColorTheme(theme));
    applyColorTheme(theme, memberId);
  };

  // 인증 상태 확인
  // 앱 최초 로드, 새로고침, visibility/online 재검증에서 사용
  const ensureAuth = useCallback(async () => {
    // 이미 실행 중이면 중복 호출 방지
    if (ensureAuthInFlightRef.current) {
      return false;
    }

    ensureAuthInFlightRef.current = true;

    // UI를 checking 상태로 전환
    if (authStatus !== "checking") {
      dispatch(startAuthCheck());
    }

    try {
      // accessToken 기준 me 조회
      const me = await getMeByGraphQL();

      dispatch(
        setAuthUser({
          memberId: me.memberId,
          email: me.email,
          name: me.name,
          tel: me.tel,
          profileImage: me.profileImage,
          role: me.role,
          status: me.status,
          regdate: me.regdate,
        })
      );

      // 로그인 유저 기준 컬러 테마 복구
      applyUserTheme(me.memberId);
      return true;
    } catch {
      try {
        // accessToken 만료 시 refresh 시도
        await fetch("/api/proxy/auth/refresh", {
          method: "POST",
          credentials: "include",
        });

        // refresh 성공 후 다시 me 조회
        const me = await getMeByGraphQL();

        dispatch(
          setAuthUser({
            memberId: me.memberId,
            email: me.email,
            name: me.name,
            tel: me.tel,
            profileImage: me.profileImage,
            role: me.role,
            status: me.status,
            regdate: me.regdate,
          })
        );

        // refresh 이후에도 컬러 테마 복구
        applyUserTheme(me.memberId);
        return true;
      } catch {
        // refresh 포함 인증 완전 실패
        dispatch(clearAuth());
        return false;
      }
    } finally {
      ensureAuthInFlightRef.current = false;
    }
  }, [dispatch, authStatus]);

  // 일반 로그인
  // REST 로그인 → 쿠키 발급 → me 조회 → Redux 동기화
  const login = useCallback(
    async (email: string, password: string) => {
      dispatch(startAuthCheck());

      // 로그인 요청 (REST)
      await authRest.login(email, password);

      // 로그인 성공 후 서버 기준 사용자 조회
      const me = await getMeByGraphQL();

      dispatch(
        setAuthUser({
          memberId: me.memberId,
          email: me.email,
          name: me.name,
          tel: me.tel,
          profileImage: me.profileImage,
          role: me.role,
          status: me.status,
          regdate: me.regdate,
        })
      );

      // 로그인 직후 컬러 테마 복구
      applyUserTheme(me.memberId);
      return true;
    },
    [dispatch]
  );

  // 로그아웃
  // 서버 세션 종료 여부와 무관하게 로컬 상태 초기화
  const logout = useCallback(async () => {
    try {
      await authRest.logout();
    } catch {
      // accessToken 만료로 서버 로그아웃 실패해도 정상 흐름
    }

    // 인증 상태 초기화
    dispatch(clearAuth());

    // UI 유저 종속 상태 초기화
    dispatch(setAvatarId("gradient-1"));
    dispatch(setColorTheme("pink"));

    // DOM 컬러 테마 초기화
    resetColorTheme();
  }, [dispatch]);

  return {
    ensureAuth,
    login,
    logout,
  };
}
