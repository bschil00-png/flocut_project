// 세션별 문서 목록 조회

// 특성 세션에 속한 문서 목록 조회
// 세션 상세 화면 진입 시 사용
import {gql} from "@apollo/client";

export const DOCUMENT_LIST_QUERY = gql`
      query documentList($sessionId: Long!, $page: Int, $size: Int) {
        documentList(sessionId: $sessionId, page: $page, size: $size) {
          documents {
            fileId
            fileName
            fileType
            filePath
            createdDate
            summaryId
            hasSummary 
            language
            tags
            }
          totalCount
        }
    } 
`;

// 문서 상세 조회

// 특정 문서의 상세 정보 조회
// 문서 상세 페이지에서 사용
export const DOCUMENT_DETAIL_QUERY = gql`
  query documentDetail($fileId: Long!) {
    documentDetail(fileId: $fileId) {
      fileId
      fileName
      fileType
      filePath
      createdDate
      text
      summaryCount
      summaries {
        summaryId
        sessionId
        roundNo
        versionNo
        summaryText
        summaryOption
        topic
        modelVersion
        createdDate
      }
    }
  }
`;