import {gql} from "@apollo/client";

// 문서 파일 업로드
// 업로드 직후 AI 파싱/요약 파이프라인 시작

export const UPLOAD_DOCUMENT_MUTATION = gql`
  mutation uploadDocument($file: Upload!, $sessionId: Long!) {
    uploadDocument(file: $file, sessionId: $sessionId) {
      fileId
      fileName
      filePath
      fileType
      createdDate
    }
  }
`;

//  문서 요약 생성

//  문서요약 생성 요청
//  기존요약이 있어도 항상 새 summaty 생성
export const CREATE_DOCUMENT_SUMMARY_MUTATION = gql`
  mutation createDocumentSummary(
    $fileId: Long!
    $sessionId: Long!
    $roundNo: Int!
    $option: String
    $topic: String
  ) {
    createDocumentSummary(
      fileId: $fileId
      sessionId: $sessionId
      roundNo: $roundNo
      option: $option
      topic: $topic
    ) {
      summaryId
      fileId
      sessionId
      roundNo
      summaryText
      summaryOption
      modelVersion
      createdDate
    }
  }
`;

// 문서에서는 수정은 없음 -> 노트 생성 트리거라 보면 됨

//  문서 삭제

//  실제 데이터 삭제가 아닌 soft Delete방식
export const DELETE_DOCUMENT_MUTATION = gql`
mutation deleteDocument($fileId: Long!) {
    deleteDocument(file: $fileId) {
        deleted
        message
        }
    }
`;
