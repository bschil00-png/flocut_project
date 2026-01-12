import {gql} from "@apollo/client";



// 문서 리스트 조회
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



//문서 정보
export const DOCUMENT_DETAIL_QUERY = gql`
  query document($documentId: Int!) {
    document(documentId: $documentId) {
      documentId
      fileName
      createdAt
      summary
    }
  }
`;