import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface ChatMessage {
    role: "user" | "assistant";
    content: string;
    cta?: "workspace";
}

interface ChatState {
  messages: ChatMessage[];
}

//  퍼블릭 챗복
const loadChatState = (): ChatState | null => {
  if (typeof window === "undefined") return null;

  try {
    const saved = localStorage.getItem("chat_state");
    return saved ? JSON.parse(saved) : null;
  } catch {
    return null;
  }
};


const initialState: ChatState =
    loadChatState() ?? {
    messages: [],
  };

const publicChatSlice = createSlice({
  name: "publicChat",
  initialState,
  reducers: {
    addMessage(state, action: PayloadAction<ChatMessage>) {
      state.messages.push(action.payload);
        localStorage.setItem("public_chat_state", JSON.stringify(state));
    },

    clearChat(state) {
      state.messages = [];
        localStorage.removeItem("public_chat_state");
    },
  },
});

export const { addMessage, clearChat} = publicChatSlice.actions;

export default publicChatSlice.reducer;
