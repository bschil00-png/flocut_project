import { useDispatch } from "react-redux";
import { setAuthUser, clearAuth } from "@/store/slice/authSlice";
import { getMeByGraphQL } from "@/lib/graphql/auth/auth.client";
import * as authRest from "@/lib/rest/auth/auth.rest";
import { useCallback } from "react";
import { setAvatarId, setColorTheme } from "@/store/slice/uislice";
import {
    applyColorTheme,
    getStoredColorTheme,
    resetColorTheme,
} from "@/lib/theme/colorTheme";

export function useAuthActions() {
    const dispatch = useDispatch();

    // 이미 로그인된 사용자인지 확인
    // 앱 초기 로드, 새로고침, 인증 재검증에서 사용
    const ensureAuth = useCallback(async () => {
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
            const theme = getStoredColorTheme(me.memberId);
            dispatch(setColorTheme(theme));
            applyColorTheme(theme, me.memberId);

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
                const theme = getStoredColorTheme(me.memberId);
                dispatch(setColorTheme(theme));
                applyColorTheme(theme, me.memberId);

                return true;
            } catch {
                // refresh 실패 시 인증 상태 초기화
                dispatch(clearAuth());
                return false;
            }
        }
    }, [dispatch]);

    // 일반 로그인
    // REST 로그인 → 쿠키 발급 → me 조회 → Redux 동기화
    const login = useCallback(
        async (email: string, password: string) => {
            // 로그인 요청 (REST)
            await authRest.login(email, password);

            // 로그인 성공 후 서버 기준 사용자 조회
            const me = await getMeByGraphQL();

            // Redux에 사용자 정보 저장
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
            const theme = getStoredColorTheme(me.memberId);
            dispatch(setColorTheme(theme));
            applyColorTheme(theme, me.memberId);

            return true;
        },
        [dispatch]
    );

    // 로그아웃
    // 서버 세션 종료 후 Redux 초기화
    const logout = useCallback(async () => {
        try {
            await authRest.logout();
        } catch (error) {
            // access 토큰이 없어서 403 나는 경우도 정상 시나리오
            console.warn("[logout] server logout failed, force local logout");
        }

        // 인증 상태 초기화 (서버 성공 여부와 무관)
        dispatch(clearAuth());

        // UI 유저 종속 상태 초기화
        dispatch(setAvatarId("gradient-1"));
        dispatch(setColorTheme("pink"));

        // DOM 컬러 테마 초기화
        resetColorTheme();
    }, [dispatch]);


    return { ensureAuth, login, logout };
}
