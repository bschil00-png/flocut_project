// lib/graphql/summary/summary.query.ts
import { gql } from "@apollo/client";

//  공통 요약 단건 조회 
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

//  문서 요약 히스토리 
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

//  노트 요약 히스토리 (REST API 사용) 
// 노트 최신 요약 조회
export const NOTE_LATEST_SUMMARY_QUERY = gql`
  query NoteLatestSummary($noteId: ID!) {
    noteLatestSummary(noteId: $noteId) {
      summaryId
      status
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