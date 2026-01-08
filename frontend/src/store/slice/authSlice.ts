// src/store/authSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {MemberRole, MemberStatus} from "@/lib/graphql/auth/auth.type";

export interface AuthUser {
    memberId: number;
    email: string;
    name: string;
    tel: string;
    profileImage?: string | null;
    role: MemberRole;
    status: MemberStatus;
    regdate: string;
}

interface AuthState {
    isAuthenticated: boolean;
    user: AuthUser | null;
    loading: boolean;       // 인증 처리 중 여부
    initialized: boolean;  // 앱 최초 인증 시도 완료 여부
}

const initialState: AuthState = {
    isAuthenticated: false,
    user: null,
    loading: true,
    initialized: false,
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setAuthUser(state, action: PayloadAction<AuthUser>) {
            state.user = action.payload;
            state.isAuthenticated = true;
            state.loading = false;
            state.initialized = true;
        },
        clearAuth(state) {
            state.user = null;
            state.isAuthenticated = false;
            state.loading = false;
            state.initialized = true;
        },
    },
});

export const { setAuthUser, clearAuth } = authSlice.actions;
export default authSlice.reducer;
