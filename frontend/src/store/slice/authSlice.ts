// src/store/authSlice.ts
import {createSlice, PayloadAction} from "@reduxjs/toolkit";

//  사용자 정보 타입
export interface AuthUser {
  memberId: number;
  email: string;
  name: string;
}

// 인증 상태
interface AuthState {
  isAuthenticated: boolean;
  user?: AuthUser | null;
  loading: boolean; // 초기 auth.sync 전 후 UI 분기용으로
}

const initialState: AuthState = {
  isAuthenticated: false,
  user: undefined,
  loading: true
};


const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // 로그인/ 동기화 성공 시에
    setAuthUser(state, action: PayloadAction<AuthUser>) {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.loading = false;
    },
    // 비로그인 상태/ 로그아웃 샅애
    clearAuth(state) {
      state.isAuthenticated = false;
      state.user = null; // 위에 AuthUser
      state.loading = false;
    },
  },
});

export const {setAuthUser, clearAuth} = authSlice.actions;
export default authSlice.reducer;
