import { gql } from "@apollo/client";

// 요약 단건 조회
export const SUMMARY_VIEW_BY_ID_QUERY = gql`
  query DocumentSummaryViewBySummaryId($summaryId: ID!) {
    documentSummaryViewBySummaryId(summaryId: $summaryId) {
      summaryId
      mainTopic
      keyTakeaways
      sections {
        title
        content
      }
      finalDocument
    }
  }
`;

// 요약 히스토리
export const SUMMARY_HISTORY_QUERY = gql`
  query DocumentSummaryHistory(
    $fileId: ID!
    $sessionId: ID!
    $page: PageRequestInput!
  ) {
    documentSummaryHistory(
      fileId: $fileId
      sessionId: $sessionId
      page: $page
    ) {
      content {
        summaryId
        versionNo
        status
        createdAt
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

//문서 요약 조회
export const DOCUMENT_SUMMARY_QUERY = gql`
  query DocumentSummaryByFileId($fileId: ID!) {
    documentSummaryByFileId(fileId: $fileId) {
      summaryId
      fileId
      sessionId
      status
      summaryText
      summaryOption
      modelVersion
      versionNo
      regdate
    }
  }
`;

//노트 요약 조회
export const NOTE_SUMMARY_QUERY = gql`
  query NoteSummaryByNoteId($noteId: ID!) {
    noteSummaryByNoteId(noteId: $noteId) {
      summaryId
      noteId
      sessionId
      status
      summaryText
      summaryOption
      modelVersion
      versionNo
      regdate
    }
  }
`;