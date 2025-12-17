// 프록시 서버 역할
// /api/proxy/** 요청을 받아서
// 실제 백엔드 서버로 그대로 전달

import { NextRequest, NextResponse } from "next/server";

const NEXT_PUBLIC_API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_BASE_URL!;

// 공통 프록시 함수
async function proxy(request: NextRequest) {
    // 요청된 실제 경로 추출
    // 예: /api/proxy/auth/login → /auth/login
    const { pathname, search } = new URL(request.url);
    const targetPath = pathname.replace("/api/proxy", "");

    const targetUrl = `${NEXT_PUBLIC_API_BASE_URL}${targetPath}${search}`;

    // 원본 요청 정보 그대로 전달
    const response = await fetch(targetUrl, {
        method: request.method,
        headers: request.headers,
        body:
            request.method === "GET" || request.method === "HEAD"
                ? undefined
                : request.body,
        credentials: "include", // 쿠키 전달 핵심
    });

    // 백엔드 응답 그대로 반환
    return new NextResponse(response.body, {
        status: response.status,
        headers: response.headers,
    });
}

// HTTP Method 별 export (Next.js 규칙)
export async function GET(req: NextRequest) {
    return proxy(req);
}

export async function POST(req: NextRequest) {
    return proxy(req);
}

export async function PUT(req: NextRequest) {
    return proxy(req);
}

export async function PATCH(req: NextRequest) {
    return proxy(req);
}

export async function DELETE(req: NextRequest) {
    return proxy(req);
}
