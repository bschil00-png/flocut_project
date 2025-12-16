import { createSlice } from "@reduxjs/toolkit";

interface UIState {
  sidebarOpen: boolean;
  chatOpen: boolean; // 챗봇 열림 상태
}

const initialState: UIState = {
  sidebarOpen: false,
  chatOpen: false,
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    toggleSidebar(state) {
      state.sidebarOpen = !state.sidebarOpen;
    },
    toggleChat(state) {
      state.chatOpen = !state.chatOpen;
    },
    closeChat(state) {
      state.chatOpen = false;
    },
  },
});

export const { toggleSidebar, toggleChat, closeChat } = uiSlice.actions;
export default uiSlice.reducer;
