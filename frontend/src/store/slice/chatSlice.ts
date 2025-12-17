import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

interface ChatState {
  messages: ChatMessage[];
  summary: string;
  characterMode: string;
}

/**
 * localStorage에서 채팅 상태 불러오기
 */
const loadChatState = (): ChatState | null => {
  if (typeof window === "undefined") return null;

  try {
    const saved = localStorage.getItem("chat_state");
    return saved ? JSON.parse(saved) : null;
  } catch {
    return null;
  }
};

const persistedState = loadChatState();

const initialState: ChatState =
  persistedState ?? {
    messages: [],
    summary: "",
    characterMode: "assistant",
  };

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    addMessage(state, action: PayloadAction<ChatMessage>) {
      state.messages.push(action.payload);
      localStorage.setItem("chat_state", JSON.stringify(state));
    },

    updateLastAssistantMessage(state, action: PayloadAction<string>) {
      const last = state.messages.length - 1;
      if (last >= 0 && state.messages[last].role === "assistant") {
        state.messages[last].content = action.payload;
        localStorage.setItem("chat_state", JSON.stringify(state));
      }
    },

    setSummary(state, action: PayloadAction<string>) {
      state.summary = action.payload;
      localStorage.setItem("chat_state", JSON.stringify(state));
    },

    clearChat(state) {
      state.messages = [];
      state.summary = "";
      localStorage.removeItem("chat_state");
    },

    setCharacterMode(state, action: PayloadAction<string>) {
      state.characterMode = action.payload;
      localStorage.setItem("chat_state", JSON.stringify(state));
    },
  },
});

export const {
  addMessage,
  updateLastAssistantMessage,
  setSummary,
  clearChat,
  setCharacterMode,
} = chatSlice.actions;

export default chatSlice.reducer;
