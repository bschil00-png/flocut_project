import { gql } from "@apollo/client";



// 관리자: 회원 목록 조회
export const ADMIN_MEMBERS_QUERY = gql`
  query adminMembers($page: Int!, $size: Int!) {
    adminMembers(page: $page, size: $size) {
      content {
        memberId
        email
        name
        status
        role
        regdate
      }
      totalElements
      totalPages
      pageNumber
      pageSize
      hasNext
    }
  }
`;

// 관리자: 회원 상세 조회
export const ADMIN_MEMBER_DETAIL_QUERY = gql`
  query adminMember($memberId: ID!) {
    adminMember(memberId: $memberId) {
      memberId
      email
      name
      status
      role
      regdate
      loginHistories {
        loginHistoryId
        ip
        device
        loginDate
      }
    }
  }
`;
