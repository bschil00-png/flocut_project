import {gql} from "@apollo/client";


// 세션 생성
// 새 노트 만들기
// 문서, 음성, 비교 작업의 최상위 묶음 단위 생성이라 보면 됨

export const CREATE_SESSION_MUTATION = gql`
  mutation createSession($input: SessionCreateInput!) {
    createSession(input: $input) {
      sessionId
      sessionTitle
      description
      createdDate
      status
    }
  }
`;

// 세션 수정
// 세션 설정 화면 또는 세션 제목 인라인 수정 시 사용
// 세션의 정체성만 변경 가능하도록 필드 제한
export const UPDATE_SESSION_MUTATION = gql`
  mutation updateSession($input: SessionUpdateInput!) {
    updateSession(input: $input) {
      sessionId
      sessionTitle
      description
      status
    }
  }
`;

// 세션 삭제 요청
// 실제 DB 삭제가 아닌 Soft Delete 처리
// 삭제 후 UI에서는 세션 목록에서 제거
export const DELETE_SESSION_MUTATION = gql`
  mutation deleteSession($sessionId: Long!) {
    deleteSession(sessionId: $sessionId) {
      deleted
      message
    }
  }
`;