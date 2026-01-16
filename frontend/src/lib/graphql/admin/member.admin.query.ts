import { gql } from "@apollo/client";

// 관리자 멤버 목록 조회 (페이지네이션)

export const ADMIN_MEMBERS_QUERY = gql`
  query AdminMembers($page: PageRequestInput!) {
    adminMembers(page: $page) {
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
      hasPrevious
      isFirst
      isLast
    }
  }
`;

  // 관리자 멤버 상세 조회
export const ADMIN_MEMBER_DETAIL_QUERY = gql`
  query AdminMember($memberId: ID!) {
    adminMember(memberId: $memberId) {
      memberId
      email
      name
      tel
      status
      role
      emailVerified
      regdate
    }
  }
`;

//  관리자 멤버  로그인 이력
export const ADMIN_LOGIN_HISTORY_QUERY = gql`
  query AdminLoginHistories(
    $memberId: ID!
    $page: PageRequestInput!
  ) {
    adminLoginHistories(memberId: $memberId, page: $page) {
      content {
        loginAt
        ip
        device
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

