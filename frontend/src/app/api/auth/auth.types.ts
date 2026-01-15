// dto와 비슷한 개념
// 회원가입 요청
export interface MemberRegisterRequest {
  email: string;
  password: string;
  name: string;
  tel?: string;
  agreeTerms: boolean;
  profileImage?: string;
}
