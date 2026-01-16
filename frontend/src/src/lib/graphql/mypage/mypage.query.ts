import { gql } from "@apollo/client";

// 마이페이지 대시보드 조회
export const MY_PAGE_OVERVIEW_QUERY = gql`
  query myPage {
    myPage {
      documents {
        fileId
        fileName
        uploadDate
      }
      audios {
        fileId
        durationSec
      }
      compares {
        compareRequestId
        regdate
      }
      sessions {
        sessionId
        sessionTitle
      }
      totalDocumentCount
      totalAudioCount
      totalCompareCount
    }
  }
`;

// 로그인 히스토리
export const LOGIN_HISTORY_QUERY = gql`
  query loginHistory {
    loginHistory {
      loginHistoryId
      ip
      device
      loginDate
    }
  }
`;
