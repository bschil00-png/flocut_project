import { configureStore } from "@reduxjs/toolkit";
import authReducer from "@/store/slice/authSlice";
import uiReducer from "@/store/slice/uislice";
import chatReducer from "@/store/slice/chatSlice"; // 추가

export const index = configureStore({
  reducer: {
    auth: authReducer,
    //   토글 같은 경우 context에 사용하는 경우도 있음
    ui: uiReducer,
    chat: chatReducer,
  },
});

export type RootState = ReturnType<typeof index.getState>;
export type AppDispatch = typeof index.dispatch;
