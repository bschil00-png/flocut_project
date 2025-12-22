

// 오디오 처리 상태 (UI 기준)

// 실제 DB 상태들을 종합해서 프론트에서 표현하기 위한 상태
export type AudioStatus =
    | "UPLOADED"     // 파일 업로드 완료
    | "PROCESSING"   // STT 또는 요약 처리 중
    | "COMPLETED"    // 요약까지 완료
    | "FAILED"       // 처리 실패
    | "DELETED";     // Soft Delete

// 오디오 목록 아이템

// 세션 상세 화면에서 오디오 리스트를 그릴 때 사용하는 최소 단위
// document 리스트와 구조 비슷
export interface AudioItem {
    fileId: number;              // 음성 파일 PK (tbl_file.file_id)
    fileName: string;            // 원본 파일명
    filePath: string;            // S3 접근 URL

    durationSec?: number;        // 음성 길이(초)
    language?: string | null;    // 감지된 언어

    // STT 관련 정보
    sttId?: number | null;       // 최신 STT PK
    sttStatus?: string | null;   // STT 상태 (PENDING / PROCESSING / COMPLETED / FAILED)

    // 요약 관련 정보
    summaryId?: number | null;   // 최신 요약 PK
    hasSummary: boolean;         // 요약 존재 여부

    status: AudioStatus;         // 종합 상태
    createdDate: string;         // 업로드 시점 (regdate 대응)
}

// 오디오 상세 조회

// 오디오 상세 페이지에서 사용하는 타입
// STT 결과와 요약 결과
export interface AudioDetail {
    fileId: number;              // 음성 파일 PK
    fileName: string;            // 파일명
    filePath: string;            // S3 경로

    // 메타데이터 (tbl_audio_meta)
    durationSec?: number;        // 길이(초)
    sampleRate?: number | null;  // 샘플레이트
    channels?: number | null;    // 채널 수
    codec?: string | null;       // 코덱 정보
    language?: string | null;    // 언어

    // STT 결과 (1개)
    stt?: AudioSTT | null;

    // 요약 결과 (여러 개 가능)
    summaries: AudioSummary[];
    summaryCount: number;        // 요약 개수

    createdDate: string;         // 업로드 시점
}

// STT 결과 타입
// 음성 → 텍스트 변환 결과
// 실패 가능 -> 상태 있음
export interface AudioSTT {
    sttId: number;               // STT PK (tbl_audio_stt.stt_id)
    fileId: number;              // 원본 음성 파일 PK

    sttText?: string | null;     // 변환된 전체 텍스트
    sttStatus: string;           // PENDING / PROCESSING / COMPLETED / FAILED
    errorMessage?: string | null;// 실패 시 오류 메시지

    engineType?: string | null;  // Whisper / Clova / E.Labs 등

    createdDate: string;         // 요청 시각 (regdate)
    modifiedDate: string;        // 상태 변경 시각 (moddate)
}

// 오디오 요약 결과 타입

// STT 결과를 기반으로 생성된 요약
// document summary와 거의 동일한 구조
export interface AudioSummary {
    audioSummaryId: number;      // 요약 PK
    sttId: number;               // STT PK
    sessionId: number;           // 세션 PK
    roundNo: number;             // 회차 번호

    summaryText: string;         // 요약 텍스트
    summaryOption?: string;      // 요약 옵션 (짧게/중간/길게)
    modelVersion?: string;       // 사용된 LLM 버전

    createdDate: string;         // 생성일
}

// 오디오 업로드 결과

// 업로드 직후 서버에서 반환하는 정보
export interface AudioUploadResult {
    fileId: number;              // 생성된 파일 PK
    fileName: string;            // 파일명
    filePath: string;            // S3 접근 URL
    createdDate: string;         // 업로드 시점
}

// STT 요청 결과

// STT 요청 직후 반환되는 응답
export interface AudioSTTResult {
    sttId: number;               // STT PK
    fileId: number;              // 음성 파일 PK
    sttStatus: string;           // 초기 상태
    createdDate: string;         // 요청 시각
}

// 오디오 요약 요청 결과

// 요약 생성 요청 후 반환되는 응답
export interface AudioSummaryResult {
    audioSummaryId: number;      // 요약 PK
    sttId: number;               // STT PK
    sessionId: number;           // 세션 PK
    roundNo: number;             // 회차 번호

    summaryText: string;         // 요약 결과
    summaryOption?: string;      // 요약 옵션
    modelVersion?: string;       // LLM 버전

    createdDate: string;         // 생성일
}
