import { gql } from "@apollo/client";

export const RECORDS_BY_SESSION_QUERY = gql`
  query RecordsBySession($sessionId: ID!, $page: PageRequestInput!) {
    recordsBySession(sessionId: $sessionId, page: $page) {
      content {
        recordId
        sessionId
        noteId
        content
        createdAt
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