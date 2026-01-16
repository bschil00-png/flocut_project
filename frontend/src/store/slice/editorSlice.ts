// store/slice/editorSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface EditorState {
  noteId: number | null;
  fileId: number | null; // 추가: 문서/파일 ID
  title: string;
}

const initialState: EditorState = {
  noteId: null,
  fileId: null, // 추가
  title: "",
};

const editorSlice = createSlice({
  name: "editor",
  initialState,
  reducers: {
    // 에디터 진입 시 초기화 (노트용)
    setEditingNote(state, action: PayloadAction<{ noteId: number; title: string }>) {
      state.noteId = action.payload.noteId;
      state.fileId = null; // 노트이므로 파일 ID는 비움
      state.title = action.payload.title;
    },
    // 추가: 문서/파일 진입 시 초기화
    setEditingFile(state, action: PayloadAction<{ fileId: number; title: string }>) {
      state.fileId = action.payload.fileId;
      state.noteId = null; // 파일이므로 노트 ID는 비움
      state.title = action.payload.title;
    },
    updateLocalTitle(state, action: PayloadAction<string>) {
      state.title = action.payload;
    },
    clearEditor: () => initialState,
  },
});

export const { setEditingNote, setEditingFile, updateLocalTitle, clearEditor } = editorSlice.actions;
export default editorSlice.reducer;