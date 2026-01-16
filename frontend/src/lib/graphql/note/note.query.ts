import {gql} from "@apollo/client";

export const NOTES_BY_STATUS_QUERY = gql`
  query NotesByStatus(
    $sessionId: ID!
    $status: CommonStatus!
    $page: PageRequestInput!
  ) {
    notesByStatus(
      sessionId: $sessionId
      status: $status
      page: $page
    ) {
      content {
        noteId
        sessionId
        title
        sourceType
        sourceId
        status
        regdate
        moddate
      }
      totalElements
      totalPages
      pageNumber
      pageSize
      hasNext
      hasPrevious
      isFirst
      isLast
    }
  }
`;
//  휴지통에서 전체 노트 조회(삭제 상태)
export const ALL_DELETED_NOTES_QUERY = gql`
  query AllDeletedNotes($page: PageRequestInput!) {
    allDeletedNotes(page: $page) {
      content {
        noteId
        sessionId
        title
        sourceType
        sourceId
        status
        regdate
        moddate
        deletedAt
      }
      totalElements
      totalPages
      pageNumber
      pageSize
      hasNext
      hasPrevious
      isFirst
      isLast
    }
  }
`;

export const NOTE_DETAIL_QUERY = gql`
  query NoteDetail($noteId: ID!) {
    noteDetail(noteId: $noteId) {
      noteId
      sessionId
      title
      content
      summaryOption
      sourceType
      sourceId
      status
      regdate
      moddate
      deletedAt
    }
  }
`;
