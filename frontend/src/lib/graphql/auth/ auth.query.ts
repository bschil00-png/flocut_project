import { gql } from "@apollo/client";

// 현재 로그인한 사용자 조회
// 인증 컨텍스트 기반 (쿠키)
export const ME_QUERY = gql`
  query me {
    me {
      memberId
      email
      name
      role
      profileImage
      status
      regdate
    }
  }
`;
