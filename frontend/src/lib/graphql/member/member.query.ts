import {gql} from '@apollo/client';


// 인증 처리 도메인은 RestAPI (로그인/ 회원가입/ 로그아웃)
// 현재 로그인된 사용자의 조회 전용 데이터

// 지금 DTO  설계 기준으로 MemberResponse, Profile, mypageOverView, history

// MemberResponse
// MeResponse
// 헤더, 마이페이지 , 권한 체크, 리덕스 초기화에 사용 예정
export const ME_QUERY = gql`
  query me {
    me {
      memberId
      email
      name
      profileImage
      status
      regdate
    }
  }
`;


// 마이페이지용
//MyPageOverviewResponse
export const MY_PAGE_OVERVIEW_QUERY = gql`
  query myPageOverview {
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


// 로그인 히스토리 (로그인 내역)
// MemberLoginHistoryResponse
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