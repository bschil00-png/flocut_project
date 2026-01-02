
// GraphQL 응답 타입을 제네릭으로 명시
import {NotesBySessionResponse} from "@/lib/graphql/note/note.type";
import {NOTE_LIST_QUERY} from "@/lib/graphql/note/note.query";
import {useQuery} from "@apollo/client/react";

export function useNotesBySession(sessionId: number) {
  return useQuery<NotesBySessionResponse>(NOTE_LIST_QUERY, {
    variables: { sessionId },
    skip: !sessionId,
  });
}
