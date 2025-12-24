export function googleLoginHandler() {
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!;
  const redirectUri = "http://localhost:3000/auth/google/callback";

  const googleAuthUrl =
    "https://accounts.google.com/o/oauth2/v2/auth" +
    `?client_id=${clientId}` +
    `&redirect_uri=${encodeURIComponent(redirectUri)}` +
    "&response_type=code" +
    "&scope=openid%20email%20profile";

  // 구글 로그인 페이지로 직접 이동
  window.location.href = googleAuthUrl;
}
