import {useDispatch} from "react-redux";
import {setAuthUser, clearAuth} from "@/store/slice/authSlice";
import * as authRest from "../lib/rest/auth/auth.rest";
import {useCallback} from "react";
import {getMeByGraphQL} from "@/lib/graphql/auth/auth.client";
// 인증 관련 행위를 하나의 인터페이스로 제공
//  컴포넌트는 api나 리덕스를 알 필요가 없음

export function useAuthActions() {
  const dispatch = useDispatch();

  // 로그인 성공 후 반드시 서버 기준 /auth/me 재조회
  // 일반 로그인
  async function login(email: string, password: string) {
    // 로그인 → 쿠키 발급
    await authRest.login(email, password);

    //  서버 기준 사용자 조회
      const me = await getMeByGraphQL();

    // Redux 저장
    dispatch(
      setAuthUser({
        memberId: me.memberId,
        email: me.email,
        name: me.name,
        role: me.role,
      })
    );
  }

// 로그아웃 => 사용자 액션
  const logout = useCallback(async () => {
    await authRest.logout();
    dispatch(clearAuth());
  }, [dispatch]);


  // 인증 동기화 =>  새로고침/ 외부 로그인 동기화용 => 그래프 큐엘로 변환
  // 멱등성 보장, 여러 번 호출되어도 안전하게
  // const sync  = useCallback( async () => {
  //   try {
  //     const me = await authRest.getMe();
  //     dispatch(
  //       setAuthUser({
  //         memberId: me.memberId,
  //         email: me.email,
  //         name: me.name,
  //           role: me.role,
  //       })
  //     );
  //   } catch {
  //     // 쿠키가 없거나 만료된 경우
  //     // 비로그인 상태는 정상 처리
  //     dispatch(clearAuth());
  //   }
  // }, [dispatch]);

  // 보호된 페이지 진입 시 인증 보장
  // refresh까지 포함한 완전한 인증 체크
    // 새로고침 동기화
    const sync = useCallback(async () => {
        try {
            const me = await getMeByGraphQL();

            dispatch(
                setAuthUser({
                    memberId: me.memberId,
                    email: me.email,
                    name: me.name,
                    role: me.role,
                })
            );
        } catch {
            dispatch(clearAuth());
        }
    }, [dispatch]);

    // 보호된 페이지 인증 보장
    const ensureAuth = useCallback(async () => {
        try {
            const me = await getMeByGraphQL();

            dispatch(
                setAuthUser({
                    memberId: me.memberId,
                    email: me.email,
                    name: me.name,
                    role: me.role,
                })
            );
            return true;
        } catch {
            dispatch(clearAuth());
            return false;
        }
    }, [dispatch]);

    return { login, logout, sync, ensureAuth };
}
