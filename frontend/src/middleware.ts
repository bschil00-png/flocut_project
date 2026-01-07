import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {isProtectedPath} from "@/config/auth.config";

export function middleware(request: NextRequest) {
  // const accessToken = request.cookies.get("accessToken");
  const refreshToken = request.cookies.get("refreshToken");
  // 요청 경로
  const pathname = request.nextUrl.pathname;

  if (isProtectedPath(pathname) && !refreshToken) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }


  return NextResponse.next();
}

export const config = {
  matcher: [
    "/notes/:path*",
    "/documents/:path*",
    // "/workspace/:path*",
    "/mypage/:path*",
  ],
};

