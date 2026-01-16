import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type ColorTheme = "pink" | "blue" | "navy";

interface UIState {
    sidebarOpen: boolean;
    chatOpen: boolean;
    colorTheme: ColorTheme;
    avatarId: string;
}

const initialState: UIState = {
    sidebarOpen: false,
    chatOpen: false,
    colorTheme: "pink",
    avatarId: "gradient-1",
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
        setColorTheme(state, action: PayloadAction<ColorTheme>) {
            state.colorTheme = action.payload;
        },
        setAvatarId(state, action: PayloadAction<string>) {
            state.avatarId = action.payload;
        },
    },
});

export const {
    toggleSidebar,
    toggleChat,
    closeChat,
    setColorTheme,
    setAvatarId,
} = uiSlice.actions;

export default uiSlice.reducer;
