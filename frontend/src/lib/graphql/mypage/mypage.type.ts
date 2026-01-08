//   마이페이지용 타입 정리

export interface MyPageDocumentItem {
    fileId: number;
    fileName: string;
    uploadDate: string;
}

export interface MyPageAudioItem {
    fileId: number;
    durationSec: number;
}

export interface MyPageCompareItem {
    compareRequestId: number;
    regdate: string;
}

export interface MyPageSessionItem {
    sessionId: number;
    sessionTitle: string;
}

export interface MyPageOverview {
    documents: MyPageDocumentItem[];
    audios: MyPageAudioItem[];
    compares: MyPageCompareItem[];
    sessions: MyPageSessionItem[];
    totalDocumentCount: number;
    totalAudioCount: number;
    totalCompareCount: number;
}
