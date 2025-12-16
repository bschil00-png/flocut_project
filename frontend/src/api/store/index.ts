import { configureStore } from "@reduxjs/toolkit";
import authReducer from "@/api/slice/authSlice";
import uiReducer from "@/api/slice/uislice";
import chatReducer from "@/api/slice/chatSlice"; // 추가

export const store = configureStore({
  reducer: {
    auth: authReducer,
    ui: uiReducer,
    chat: chatReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
