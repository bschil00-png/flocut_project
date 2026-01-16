import { api } from "@/lib/axios";
import { SessionCreateInput, SessionUpdateInput } from "@/lib/graphql/session/session.type";

export interface SessionUpdatePayload {
    sessionTitle?: string;
    description?: string | null;
}
// 세션(워크스페이스) 생성
// - REST API 사용
// - 인증은 쿠키 기반 (axios interceptor 처리)
export async function createSession(payload: SessionCreateInput) {
    return api.post("/api/sessions", payload);
}

export function updateSession(
    sessionId: number,
    payload: SessionUpdatePayload
) {
    return api.patch(`/api/sessions/${sessionId}`, payload);
}

export function deleteSession(sessionId: number) {
    return api.delete(`/api/sessions/${sessionId}`);
}