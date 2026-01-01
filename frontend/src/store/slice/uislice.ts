import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type ColorTheme = "pink" | "blue" | "navy";

interface UIState {
  sidebarOpen: boolean;
  chatOpen: boolean;
  colorTheme: ColorTheme; // 컬러 테마 (전역 UI 상태)
}

const initialState: UIState = {
  sidebarOpen: false,
  chatOpen: false,
  colorTheme: "pink", // 기본 테마
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    // 사이드바 토글
    toggleSidebar(state) {
      state.sidebarOpen = !state.sidebarOpen;
    },

    // 챗봇 토글
    toggleChat(state) {
      state.chatOpen = !state.chatOpen;
    },

    // 챗봇 강제 종료
    closeChat(state) {
      state.chatOpen = false;
    },

    // 컬러 테마 설정
    setColorTheme(state, action: PayloadAction<ColorTheme>) {
      state.colorTheme = action.payload;
    },
  },
});

export const {
  toggleSidebar,
  toggleChat,
  closeChat,
  setColorTheme,
} = uiSlice.actions;

export default uiSlice.reducer;
