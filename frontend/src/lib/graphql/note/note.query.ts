import { gql } from "@apollo/client";

// 세션별 노트 목록 조회

export const NOTES_BY_STATUS_QUERY = gql`
  query NotesByStatus($sessionId: ID!, $status: CommonStatus!) {
    notesByStatus(sessionId: $sessionId, status: $status) {
      noteId
      sessionId
      title
      sourceType
      sourceId
      status
      regdate
      moddate
    }
  }
`;

// 노트 하나의 상세 정보 조회
// GraphQL noteDetail은 DB 기준이므로 보기/미리보기 용도
export const NOTE_DETAIL_QUERY = gql`
  query NoteDetail($noteId: ID!) {
    noteDetail(noteId: $noteId) {
      noteId
      sessionId
      title
      content
      sourceType
      sourceId
      status
      regdate
      moddate
    }
  }
`;