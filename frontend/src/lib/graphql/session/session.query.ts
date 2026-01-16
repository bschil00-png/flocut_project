import { gql } from "@apollo/client";


// 네비용 세션 목록 (페이지네이션 없음)
export const MY_SESSIONS_QUERY = gql`
  query MySessions {
    mySessions {
      sessionId
      sessionTitle
      status
      regdate
      moddate
    }
  }
`;

// 세션 리스트 조회 (페이지네이션 추가)
export const SESSIONS_QUERY = gql`
  query Sessions($page: PageRequestInput!) {
    sessions(page: $page) {
      content {
        sessionId
        sessionTitle
        description
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


// Session 상세 조회
export const SESSION_DETAIL_QUERY = gql`
  query Session($sessionId: ID!) {
    session(sessionId: $sessionId) {
      sessionId
      sessionTitle
      description
      status
      regdate
      moddate
      documentCount
      audioCount
      roundMin
      roundMax
    }
  }
`;