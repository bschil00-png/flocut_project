import { gql } from "@apollo/client";


// Session List Query

export const SESSIONS_QUERY = gql`
  query sessions {
    sessions {
      sessionId
      sessionTitle
      description
      regdate
      moddate
      status
    }
  }
`;


// Session Detail Query

export const SESSION_DETAIL_QUERY = gql`
  query session($sessionId: ID!) {
    session(sessionId: $sessionId) {
      sessionId
      sessionTitle
      description
      regdate
      moddate
      status
      documentCount
      audioCount
    }
  }
`;