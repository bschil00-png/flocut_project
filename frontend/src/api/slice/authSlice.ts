import { createSlice } from "@reduxjs/toolkit";

/**
 * 인증 상태 슬라이스
 * - 실제 로그인 구현 전까지는 구조 예제용
 */
const authSlice = createSlice({
    name: "auth",
    initialState: {
        isAuthenticated: false,
    },
    reducers: {},
});

export default authSlice.reducer;
