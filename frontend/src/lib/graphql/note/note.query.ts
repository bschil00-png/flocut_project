import { gql } from "@apollo/client";

// 세션별 노트 목록 조회


export const NOTE_LIST_QUERY = gql`
  query NotesBySession($sessionId: ID!) {
    notesBySession(sessionId: $sessionId) {
      noteId
      title
      regdate
      moddate
      sourceType
      sourceId
    }
  }
`;
// 특정 세션에 속한 노트 목록 조회 (나중에 컬럼 추가할 예정- 위에 버전 사용)
// 워크스페이스(세션) 진입 시 사용
// export const NOTE_LIST_QUERY = gql`
//   query noteList($sessionId: Long!) {
//     noteList(sessionId: $sessionId) {
//       noteId
//       sessionId
//       title
//       status
//       regdate
//       moddate
//     }
//   }
// `;

// 노트 상세 조회

// 노트 하나의 상세 정보 조회
// 노트 편집 화면에서 사용
export const NOTE_DETAIL_QUERY = gql`
  query noteDetail($noteId: ID!){
    noteDetail(noteId: $noteId) {
      noteId
      sessionId
      memberId
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
