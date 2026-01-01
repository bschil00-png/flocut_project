
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
    roundMin?: number | null;
    roundMax?: number | null;
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


// Mutation Results

export interface SessionDeleteResult {
    sessionId: number;
    deleted: boolean;
    message?: string | null;
}
// GraphQL Query Response Types
export interface SessionsQueryResponse {
    sessions: SessionItem[];
}
export interface SessionDetailQueryResponse {
    session: SessionDetail;
}
