import { useDispatch } from "react-redux";
import { setAuthUser, clearAuth } from "@/store/slice/authSlice";
import * as authRest from "@/lib/rest/auth.rest";

export function useAuth() {
  const dispatch = useDispatch();

  async function login(email: string, password: string) {
    // 로그인 → 쿠키 발급
    await authRest.login(email, password);

    //  서버 기준 사용자 조회
    const me = await authRest.getMe();

    // 3Redux 저장
    dispatch(
      setAuthUser({
        memberId: me.memberId,
        email: me.email,
        name: me.name,
      })
    );
  }

  async function logout() {
    await authRest.logout();
    dispatch(clearAuth());
  }

  return { login, logout };
}
