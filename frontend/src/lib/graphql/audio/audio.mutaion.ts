import { gql } from "@apollo/client";


// 음성 파일 업로드
// 사용자가 음성 파일을 업로드할 때 최초로 호출
// 업로드가 완료되면 file 레코드와 audio_meta가 생성
export const UPLOAD_AUDIO_MUTATION = gql`
  mutation uploadAudio($file: Upload!, $sessionId: Long!) {
    uploadAudio(file: $file, sessionId: $sessionId) {
      fileId
      fileName
      filePath
      createdDate
    }
  }
`;

// STT 요청
// 업로드된 음성 파일을 대상으로 음성 → 텍스트 변환 요청
// 요약 생성 전에 반드시 한 번은 거쳐야 하는 단계
export const REQUEST_AUDIO_STT_MUTATION = gql`
  mutation requestAudioSTT($fileId: Long!, $engine: String!) {
    requestAudioSTT(fileId: $fileId, engine: $engine) {
      sttId
      fileId
      sttStatus
      createdDate
    }
  }
`;

// 오디오 요약 생성
// STT가 COMPLETED 상태일 때만 호출 가능
// 기존 요약이 있더라도 항상 새로운 요약을 생성
export const CREATE_AUDIO_SUMMARY_MUTATION = gql`
  mutation createAudioSummary(
    $sttId: Long!
    $sessionId: Long!
    $roundNo: Int!
    $option: String
  ) {
    createAudioSummary(
      sttId: $sttId
      sessionId: $sessionId
      roundNo: $roundNo
      option: $option
    ) {
      audioSummaryId
      sttId
      sessionId
      roundNo
      summaryText
      summaryOption
      modelVersion
      createdDate
    }
  }
`;


// 오디오 삭제 (Soft Delete)
// 실제 데이터 삭제가 아닌 상태 변경
export const DELETE_AUDIO_MUTATION = gql`
  mutation deleteAudio($fileId: Long!) {
    deleteAudio(fileId: $fileId) {
      deleted
      message
    }
  }
`;
