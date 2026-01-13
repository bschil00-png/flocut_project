import { useDispatch } from "react-redux";
import { setAuthUser, clearAuth } from "@/store/slice/authSlice";
import { getMeByGraphQL } from "@/lib/graphql/auth/auth.client";
import * as authRest from "@/lib/rest/auth/auth.rest";
import { useCallback } from "react";
import {setAvatarId} from "@/store/slice/uislice";

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

            return true;
        },
        [dispatch]
    );

    // 로그아웃
    // 서버 세션 종료 후 Redux 초기화
    const logout = useCallback(async () => {
        await authRest.logout();
        dispatch(clearAuth());
        dispatch(setAvatarId("gradient-1"));
    }, [dispatch]);

    return { ensureAuth, login, logout };
}
