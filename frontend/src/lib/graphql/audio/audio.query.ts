import { gql } from "@apollo/client";


// 세션별 오디오 목록 조회
// 워크스페이스(세션) 안에 업로드된 음성 파일 목록을 조회
// 리스트 화면에서 카드/테이블 형태로 사용
// document 리스트와 동일한 역할
export const AUDIO_LIST_QUERY = gql`
  query audioList($sessionId: Long!) {
    audioList(sessionId: $sessionId) {
      fileId
      fileName
      filePath
      durationSec
      language

      sttId
      sttStatus

      summaryId
      hasSummary

      status
      createdDate
    }
  }
`;


// 오디오 상세 조회
// 특정 음성 파일 하나의 상세 정보 조회
// STT 결과 + 요약 결과를 함께 조회
// 오디오 상세 페이지에서 사용
export const AUDIO_DETAIL_QUERY = gql`
  query audioDetail($fileId: Long!) {
    audioDetail(fileId: $fileId) {
      fileId
      fileName
      filePath

      durationSec
      sampleRate
      channels
      codec
      language

      stt {
        sttId
        fileId
        sttText
        sttStatus
        errorMessage
        engineType
        createdDate
        modifiedDate
      }

      summaries {
        audioSummaryId
        sttId
        sessionId
        roundNo
        summaryText
        summaryOption
        modelVersion
        createdDate
      }

      summaryCount
      createdDate
    }
  }
`;
