import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type EditorState = {
    noteId: number | null;
    title: string;
    content: string;
    isDirty: boolean;
};

const initialState: EditorState = {
    noteId: null,
    title: "",
    content: "",
    isDirty: false,
};

const editorSlice = createSlice({
    name: "editor",
    initialState,
    reducers: {
        initEditor(
            state,
            action: PayloadAction<{
                noteId: number;
                title: string;
                content: string;
            }>
        ) {
            state.noteId = action.payload.noteId;
            state.title = action.payload.title;
            state.content = action.payload.content;
            state.isDirty = false;
        },

        updateTitle(state, action: PayloadAction<string>) {
            state.title = action.payload;
            state.isDirty = true;
        },

        updateContent(state, action: PayloadAction<string>) {
            state.content = action.payload;
            state.isDirty = true;
        },

        clearEditor() {
            return initialState;
        },
    },
});

export const {
    initEditor,
    updateTitle,
    updateContent,
    clearEditor,
} = editorSlice.actions;

export default editorSlice.reducer;
