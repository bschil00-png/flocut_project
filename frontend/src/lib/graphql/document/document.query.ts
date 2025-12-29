import {gql} from "@apollo/client";


// 내가 업로드한 파일 목록 조회
export const MY_FILES_QUERY = gql`
  query MyFiles {
    myFiles {
      fileId
      fileName
      fileType
      fileSize
      status
      regdate
    }
  }
`;

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

// 문서 상세 조회

// 특정 문서의 상세 정보 조회
// 문서 상세 페이지에서 사용
// 이후에 더 추가해서 사용
// export const DOCUMENT_DETAIL_QUERY = gql`
//   query documentDetail($fileId: Long!) {
//     documentDetail(fileId: $fileId) {
//       fileId
//       fileName
//       fileType
//       filePath
//       createdDate
//       text
//       summaryCount
//       summaries {
//         summaryId
//         sessionId
//         roundNo
//         versionNo
//         summaryText
//         summaryOption
//         topic
//         modelVersion
//         createdDate
//       }
//     }
//   }
// `;

//일단 임시
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