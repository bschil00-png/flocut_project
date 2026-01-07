import {gql} from "@apollo/client";

// 파일 기준 최신 요약 조회
// 요청 , 완료는 enum 상태로 관리

export const DOCUMENT_SUMMARY_QUERY = gql`
  query DocumentSummaryByFileId($fileId: ID!) {
    documentSummaryByFileId(fileId: $fileId) {
      summaryId
      fileId
      status
      summaryText
      modelVersion
    }
  }
`;