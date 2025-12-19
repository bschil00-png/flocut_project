import {NextResponse} from "next/server";
import type {NextRequest} from "next/server";


export function middleware(request: NextRequest) {
    // 쿠키에서 엑세스 토큰
    const accessToken = request.cookies.get("accessToken")?.value;

    // 현재 요청 경로
    const pathname = request.nextUrl.pathname;
//     로그인이 필요한 페이지 목록 (보호 페이지)
    const protectedPaths = [
        "/notes",
        "/documents",
        "/mypage",
    ];

//      회원가입 페이지/ 로그인
    const authPages = [
        "/login",
        "/register",
        "/signup",
    ];

//     로그인 안했을 때 보호 페이지 접근시
    if (
        !accessToken &&
        protectedPaths.some((path) => pathname.startsWith(path))
    ) {
        const loginUrl = new URL("/login", request.url);
        return NextResponse.redirect(loginUrl);
    }

//     로그인 했는데 로그인/회원가입 페이지 접근하면
//     메인 페이지로 리다이렉트
    if (
        accessToken &&
        authPages.some((path) => pathname.startsWith(path))
    ) {
        const homeUrl = new URL("/", request.url);
        return NextResponse.redirect(homeUrl);
    }
    // 그 외는 통과
    return NextResponse.next();
}

// 미들웨어 적용 경로 설정
export const config = {
    matcher: [
        "/notes/:path*",
        "/documents/:path*",
        "/workspace/:path*",
        "/mypage/:path*",
        "/login",
        "/signup",
        "/register",
    ],
};
