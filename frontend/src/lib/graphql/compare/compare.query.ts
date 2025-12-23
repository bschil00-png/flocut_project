import { gql } from "@apollo/client";


// 세션별 비교 히스토리 조회
// 워크스페이스 내 비교 기록 목록
export const COMPARE_LIST_QUERY = gql`
  query compareList($sessionId: Long!) {
    compareList(sessionId: $sessionId) {
      compareRequestId
      sessionId
      modelVersion
      targetCount
      createdDate
    }
  }
`;


// 비교 상세 조회
// 이미 실행된 비교 결과 재조회
export const COMPARE_DETAIL_QUERY = gql`
  query compareDetail($compareRequestId: Long!) {
    compareDetail(compareRequestId: $compareRequestId) {
      compareRequestId
      sessionId
      addedContent
      removedContent
      shiftedFocus
      coreThemes
      modelVersion
      targetCount
      createdDate
    }
  }
  `
;
