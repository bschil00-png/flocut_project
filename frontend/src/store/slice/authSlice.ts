// store/slice/authSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { MyProfile } from "@/lib/graphql/auth/auth.type";

// 인증 상태
// checking        : 인증 확인 중 (앱 최초 로드, refresh 시)
// authenticated   : 로그인 상태
// unauthenticated : 비로그인 상태
export type AuthStatus = "checking" | "authenticated" | "unauthenticated";

interface AuthState {
  status: AuthStatus;
  user: MyProfile | null;
}

const initialState: AuthState = {
  status: "checking",
  user: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // 인증 확인 시작
    startAuthCheck(state) {
      state.status = "checking";
    },

    // 로그인 성공
    setAuthUser(state, action: PayloadAction<MyProfile>) {
      state.user = action.payload;
      state.status = "authenticated";
    },
    //  업데이트
    updateAuthUser(
      state,
      action: PayloadAction<Partial<MyProfile>>
    ) {
      if (!state.user) return;
      state.user = {
        ...state.user,
        ...action.payload,
      };
    },


    // 인증 실패 또는 로그아웃
    clearAuth(state) {
      state.user = null;
      state.status = "unauthenticated";
    },
  },
});



export const { startAuthCheck, updateAuthUser, setAuthUser, clearAuth } = authSlice.actions;
export default authSlice.reducer;
