import { api } from "@/lib/axios";
import { MeResponse } from "./auth.types";
import {MemberRegisterRequest} from "@/app/api/auth/auth.types";

// 로그인
// 반환값은 지금 사용 안 하므로 void 처리
export function login(email: string, password: string): Promise<void> {
    return api.post("/auth/login", {
        email,
        password,
    });
}

// 로그아웃
export function logout(): Promise<void> {
    return api.post("/auth/logout");
}

// 로그인된 사용자 조회
export function getMe(): Promise<MeResponse> {
    return api.get("/auth/me");
}


// 회원가입
export function register(data: MemberRegisterRequest): Promise<void> {
  return api.post("/auth/register", data);
}

// 이메일 인증 메일 발송
export function sendVerifyEmail(email: string): Promise<void> {
  return api.post("/auth/verify-email", { email });
}

// 이메일 인증 토큰 검증
export function verifyEmail(token: string): Promise<void> {
  return api.post("/auth/verify", { token });
}

