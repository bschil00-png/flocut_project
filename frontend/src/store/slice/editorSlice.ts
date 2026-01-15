// store/slice/editorSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface EditorState {
  noteId: number | null;
  title: string;
}

const initialState: EditorState = {
  noteId: null,
  title: "",
};

const editorSlice = createSlice({
  name: "editor",
  initialState,
  reducers: {
    // 에디터 진입 시 초기화
    setEditingNote(state, action: PayloadAction<{ noteId: number; title: string }>) {
      state.noteId = action.payload.noteId;
      state.title = action.payload.title;
    },
    // 타이핑 즉시 업데이트 (이게 목록의 제목을 바꿈)
    updateLocalTitle(state, action: PayloadAction<string>) {
      state.title = action.payload;
    },
    clearEditor: () => initialState,
  },
});

export const { setEditingNote, updateLocalTitle, clearEditor } = editorSlice.actions;
export default editorSlice.reducer;