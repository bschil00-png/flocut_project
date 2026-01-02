export function googleLoginHandler() {
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!;

    const redirectUri =
        process.env.NODE_ENV === "production"
            ? "https://flocut.imchobo.com/auth/google/callback"
            : "http://localhost:3000/auth/google/callback";

    const googleAuthUrl =
        "https://accounts.google.com/o/oauth2/v2/auth" +
        `?client_id=${clientId}` +
        `&redirect_uri=${encodeURIComponent(redirectUri)}` +
        "&response_type=code" +
        "&scope=openid%20email%20profile";

    window.location.href = googleAuthUrl;
}
