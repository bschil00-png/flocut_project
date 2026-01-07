import { deleteNote, restoreNote, moveNote, hardDeleteNote } from "@/lib/rest/note/notes.rest";
import { toast } from "sonner";

export function useNoteAction() {
  // 삭제 (휴지통)
  const handleSoftDelete = async (noteId: number, callback?: () => void) => {
    try {
      await deleteNote(noteId);
      toast.success("노트가 휴지통으로 이동되었습니다.");
      callback?.();
    } catch (err) {
      toast.error("삭제 실패");
    }
  };

  // 복구
  const handleRestore = async (noteId: number, callback?: () => void) => {
    try {
      await restoreNote(noteId);
      toast.success("노트가 복구되었습니다.");
      callback?.();
    } catch (err) {
      toast.error("복구 실패");
    }
  };

  // 이동
  const handleMove = async (noteId: number, targetSessionId: number, callback?: () => void) => {
    try {
      await moveNote(noteId, targetSessionId);
      toast.success("노트 위치가 변경되었습니다.");
      callback?.();
    } catch (err) {
      toast.error("이동 실패");
    }
  };

  return { handleSoftDelete, handleRestore, handleMove };
}