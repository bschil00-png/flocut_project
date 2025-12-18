// src/api/session/session.type.ts

export interface CreateSessionRequest {
  sessionTitle: string;
  description?: string;
}

export interface SessionResponse {
  sessionId: number;
  sessionTitle: string;
  description?: string;
  createdDate: string;
}
