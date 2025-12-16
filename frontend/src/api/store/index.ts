import { configureStore } from "@reduxjs/toolkit";
import authReducer from "@/api/store/slice/authSlice";
import uiReducer from "@/api/store/slice/uislice";
import chatReducer from "@/api/store/slice/chatSlice"; // 추가

export const index = configureStore({
  reducer: {
    auth: authReducer,
    ui: uiReducer,
    chat: chatReducer,
  },
});

export type RootState = ReturnType<typeof index.getState>;
export type AppDispatch = typeof index.dispatch;
