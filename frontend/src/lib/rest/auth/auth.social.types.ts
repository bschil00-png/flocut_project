// 어떤 소셜 제공자를 지원하는지 명확히 제한한다
// 문자열 하드코딩을 방지하기 위한 타입
export type SocialProvider = "google" | "naver" | "kakao";

// window.open 옵션을 타입으로 분리
export interface SocialLoginWindowOptions {
  width?: number;
  height?: number;
  name?: string;
}
