// dto와 비슷한 개념

// 로그인 요청
export interface LoginRequest {
  email: string;
  password: string;
}

// 로그인 성공시 반환
export interface LoginResponse {
  memberId: number;
  accessToken: string;
}
// 이메일 인증
export interface EmailVerifyRequest {
  email: string;
}

export interface EmailVerifyConfirmRequest {
  token: string;
}

// 회원가입 요청
export interface MemberRegisterRequest {
  email: string;
  password: string;
  name: string;
  agreeTerms: boolean;
  profileImage?: string;
}
