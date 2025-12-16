// src/store/authSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
  isAuthenticated: boolean;
  memberId?: number;
  accessToken?: string;
}

const initialState: AuthState = {
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginSuccess(
      state,
      action: PayloadAction<{
        memberId: number;
        accessToken: string;
      }>
    ) {
      state.isAuthenticated = true;
      state.memberId = action.payload.memberId;
      state.accessToken = action.payload.accessToken;
    },

    logout(state) {
      state.isAuthenticated = false;
      state.memberId = undefined;
      state.accessToken = undefined;
    },
  },
});

export const { loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;
