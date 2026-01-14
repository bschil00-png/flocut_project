import {MemberRegisterRequest} from "@/app/api/auth/auth.types";
import {api} from "@/lib/axios";
import {FindEmailResponse} from "@/lib/graphql/auth/auth.type";


// 로그인
// 반환값은 지금 사용 안 하므로 void 처리
export function login(email: string, password: string): Promise<void> {
    return api.post("/auth/login", {email, password});
}

// 로그아웃
export function logout(): Promise<void> {
    return api.post("/auth/logout");
}


// 회원가입
export function register(data: MemberRegisterRequest): Promise<void> {
    return api.post("/auth/register", data);
}

// 이메일 인증 메일 발송
export function sendVerifyEmail(email: string): Promise<void> {
    return api.post("/auth/verify-email", {email});
}

// 이메일 인증 토큰 검증
export function verifyEmail(token: string): Promise<void> {
    return api.post("/auth/verify", {token});
}

// 아이디 (이메일 찾기)

export function findEmail(tel: string): Promise<FindEmailResponse> {
    return api.post("/auth/find-email", { tel });
}


// 비밀번호 재 설정 요청
export function requestPasswordReset(email: string): Promise<void> {
    return api.post("/auth/password/reset-request", {email});
}

// 새 비밀번호 설정(토큰 페이지)
export function resetPassword(
    token: string,
    newPassword: string
): Promise<void> {
    return api.post("/auth/password/reset", {
        token,
        newPassword
    });
}

// 로그인된 사용자의 비밀번호 변경 (설정 페이지용)
export function changePassword(
    currentPassword: string,
    newPassword: string
): Promise<void> {
    return api.post("/auth/password/change", {
        currentPassword,
        newPassword
    });
}