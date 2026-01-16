import { gql } from "@apollo/client";

export const SESSION_FILES_QUERY = gql`
  query SessionFiles($sessionId: ID!, $page: PageRequestInput!) {
    sessionFiles(sessionId: $sessionId, page: $page) {
      content {
        fileId
        fileName
        fileType
        fileSize
        status
        regdate
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

export const ROOT_FILES_QUERY = gql`
  query RootFiles {
    rootFiles {
      fileId
      fileName
      fileType
      fileSize
      status
      regdate
    }
  }
`;

export const ALL_FILES_QUERY = gql`
  query AllFiles {
    allFiles {
      fileId
      fileName
      fileType
      fileSize
      status
      regdate
    }
  }
`;