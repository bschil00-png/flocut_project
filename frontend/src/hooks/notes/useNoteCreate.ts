import { useState, useCallback } from "react";
import { createNote } from "@/lib/rest/note/notes.rest";
import { NoteCreateInput } from "@/lib/graphql/note/note.type";
import { toast } from "sonner";

// onCreated 콜백 추가
export function useNoteCreate(
    sessionId: number,
    onCreated?: () => void
) {
    const [isCreating, setIsCreating] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleCreate = useCallback(
        async (data: Partial<NoteCreateInput> = {}) => {
            setIsCreating(true);
            setError(null);

            try {
                const noteId = await createNote({
                    sessionId,
                    title: data.title || "제목 없음",
                    content: data.content || "",
                    sourceType: data.sourceType,
                    sourceId: data.sourceId,
                });

                toast.success("노트가 생성되었습니다");

                //  생성 완료 후 콜백 실행
                // (리스트 refetch 용도)
                onCreated?.();

                return noteId;
            } catch (err: any) {
                const message =
                    err.response?.data?.message ?? "노트 생성에 실패했습니다";
                setError(message);
                toast.error(message);
                throw err;
            } finally {
                setIsCreating(false);
            }
        },
        [sessionId, onCreated]
    );

    return { handleCreate, isCreating, error };
}
