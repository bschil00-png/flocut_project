import { gql } from "@apollo/client";

// 비교 실행
// 요약 기반 비교 수행
export const CREATE_COMPARE_MUTATION = gql`
  mutation createCompare($input: CompareCreateInput!) {
    createCompare(input: $input) {
      compareRequestId
      sessionId
      addedContent
      removedContent
      shiftedFocus
      coreThemes
      modelVersion
      createdDate
    }
  }
`;
