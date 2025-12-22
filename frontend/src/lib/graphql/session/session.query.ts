import {gql} from "@apollo/client";


//  로그인한 사용자가 생성한 세션(워크스페이스) 목록 조회
//워크스페이스 메인 화면, 좌측 사이드바, 마이페이지에서 사용
// 문서/ 음성/ 비교 생성 시 세션 선택용으로도 활용됨
export const MY_SESSION_QUERY = gql`
    query mySessions($page: Int, $size: Int, $sort: String) {
    mySessions(page: $page, size: $size, sort: $sort) {
      list {
        sessionId
        sessionTitle
        description
        createdDate
        status
      }
      totalCount
    }
  }
`;

//  세션 상세 조회
//  특정 세션의 상세 정보 조회
// 세션 상세 페이지 진입 시 최초로 호출
// 문서/ 음성/ 비교 요약을 불러오기 전,
// 세션의 기본 메타데이터와 회차 범위를 확인하기 위한 쿼리

export const SESSION_DETAIL_QUERY = gql`
    query sessionDetail($sessionId: Long!) {
        sessionDetail(sessionId: $sessionId) {
          sessionId
          sessionTitle
          description
          createdDate
          status
          documentCount
          audioCount
          roundMin
          roundMax
        } 
    }
  `
;
