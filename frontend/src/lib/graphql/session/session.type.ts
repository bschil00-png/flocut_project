
// Session Domain Types


// 세션 상태
export type SessionStatus =
    | "ACTIVE"
    | "ARCHIVED"
    | "DELETED";


// Session Item (목록 / 참조용)

export interface SessionItem {
    sessionId: number;
    sessionTitle: string;
    description?: string | null;
    regdate: string;
    moddate?: string | null;
    status: SessionStatus;
}


// Session Detail

export interface SessionDetail {
    sessionId: number;
    sessionTitle: string;
    description?: string | null;
    regdate: string;
    moddate?: string | null;
    status: SessionStatus;

    documentCount: number;
    audioCount: number;
}


export interface SessionPage {
    content: SessionItem[];
    totalElements: number;
    totalPages: number;
    pageNumber: number;
    pageSize: number;
    hasNext: boolean;
    hasPrevious: boolean;
    isFirst: boolean;
    isLast: boolean;
}

// Mutation Inputs

export interface SessionCreateInput {
    sessionTitle: string;
    description?: string | null;
}

export interface SessionUpdateInput {
    sessionId: number;
    sessionTitle?: string;
    description?: string | null;
}

export interface SessionDeleteInput {
    sessionId: number;
}


export interface MySessionsQueryResponse {
    mySessions: SessionItem[];
}

export interface SessionsQueryResponse {
    sessions: SessionPage;
}

export interface SessionDetailQueryResponse {
    session: SessionDetail;
}