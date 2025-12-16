// src/app/api/auth/authApi.ts
import {
  LoginRequest,
  LoginResponse,
  MemberRegisterRequest,
  EmailVerifyRequest,
  EmailVerifyConfirmRequest,
} from "./auth.types";

// 이후 공통 유틸
const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export const authApi = {
  //  회원가입 전 이메일 발송
  async sendVerifyEmail(request: EmailVerifyRequest): Promise<void> {
    const res = await fetch("/api/auth/email/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(request),
    });

    if (!res.ok) {
      throw new Error("EMAIL_SEND_FAILED");
    }
  },

   // 이메일 인증 토큰 검증
   //  메일 링크 클릭 시 호출

  async verifyEmail(request: EmailVerifyConfirmRequest): Promise<void> {
    const res = await fetch("/api/auth/email/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(request),
    });

    if (!res.ok) {
      throw new Error("EMAIL_VERIFY_FAILED");
    }
  },
  // 회원가입
  async register(request: MemberRegisterRequest): Promise<void> {
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(request),
      credentials: "include",
    });

    if (!res.ok) {
      throw new Error("REGISTER_FAILED");
    }
  },

  // 로그인
  // 로그인 성공 시 토큰 정보 반환
  async login(request: LoginRequest): Promise<LoginResponse> {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(request),
      credentials: "include",
    });

    if (!res.ok) {
      throw new Error("LOGIN_FAILED");
    }

    return res.json();
  },
};
