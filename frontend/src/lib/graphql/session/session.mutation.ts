import { gql } from "@apollo/client";


// Create Session

export const CREATE_SESSION_MUTATION = gql`
  mutation createSession($input: SessionCreateInput!) {
    createSession(input: $input) {
      sessionId
      sessionTitle
      description
      regdate
      moddate
      status
    }
  }
`;


// Update Session

export const UPDATE_SESSION_MUTATION = gql`
  mutation updateSession($input: SessionUpdateInput!) {
    updateSession(input: $input) {
      sessionId
      sessionTitle
      description
      regdate
      moddate
      status
    }
  }
`;


// Delete Session

export const DELETE_SESSION_MUTATION = gql`
  mutation deleteSession($input: SessionDeleteInput!) {
    deleteSession(input: $input) {
      sessionId
      deleted
      message
    }
  }
`;
