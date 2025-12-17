// src/api/session/session.api.ts
import { apiFetch } from "@/lib/api";
import {
  CreateSessionRequest,
  SessionResponse,
} from "./session.type";

// 세션 생성
export const createSession = (
  data: CreateSessionRequest
): Promise<SessionResponse> => {
  return apiFetch("/sessions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  }).then((res) => res.json());
};

// 세션 목록 조회
export const getSessions = (): Promise<SessionResponse[]> => {
  return apiFetch("/sessions").then((res) => res.json());
};

// 세션 상세 조회
export const getSessionDetail = (
  sessionId: number
): Promise<SessionResponse> => {
  return apiFetch(`/sessions/${sessionId}`).then((res) => res.json());
};
