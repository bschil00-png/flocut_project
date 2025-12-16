// src/store/authSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface AuthUser {
    memberId: number;
    email: string;
    name: string;
}

interface AuthState {
    isAuthenticated: boolean;
    user?: AuthUser;
}

const initialState: AuthState = {
    isAuthenticated: false,
    user: undefined,
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setAuthUser(state, action: PayloadAction<AuthUser>) {
            state.isAuthenticated = true;
            state.user = action.payload;
        },

        clearAuth(state) {
            state.isAuthenticated = false;
            state.user = undefined;
        },
    },
});

export const { setAuthUser, clearAuth } = authSlice.actions;
export default authSlice.reducer;
