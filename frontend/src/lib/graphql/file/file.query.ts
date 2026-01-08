import { gql } from "@apollo/client";

export const SESSION_FILES_QUERY = gql`
  query SessionFiles($sessionId: ID!) {
    sessionFiles(sessionId: $sessionId) {
      fileId
      fileName
      fileType
      fileSize
      status
      regdate
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