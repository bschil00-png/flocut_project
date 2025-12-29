// src/app/api/proxy/[...path]/route.ts
import { NextRequest, NextResponse } from "next/server";

// 백엔드 서버 기본 URL
// 프론트는 항상 /api/proxy/... 로 요청하고
// 이 프록시가 실제 백엔드 주소로 요청을 중계한다
const BACKEND_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL!;

// 공통 프록시 함수
// 이 함수의 목적은 요청을 해석하거나 가공하는 것이 아니라
// 가능한 한 원형 그대로 백엔드로 전달하는 것이다
async function proxy(request: NextRequest) {
  // 요청 URL에서 경로와 쿼리 분리
  const { pathname, search } = new URL(request.url);

  // /api/proxy/auth/login -> /auth/login
  // 프록시 prefix 제거
  let targetPath = pathname.replace("/api/proxy", "");

  // 중복 슬래시 제거
  targetPath = targetPath.replace(/\/+/g, "/");

  // 항상 슬래시로 시작하도록 보정
  if (!targetPath.startsWith("/")) {
    targetPath = "/" + targetPath;
  }

  // BACKEND_BASE_URL 끝의 슬래시 제거
  const cleanBaseUrl = BACKEND_BASE_URL.replace(/\/+$/, "");

  // 최종 백엔드 요청 URL
  const targetUrl = `${cleanBaseUrl}${targetPath}${search}`;

  console.log("\n========== PROXY REQUEST ==========");
  console.log("TARGET URL:", targetUrl);
  console.log("METHOD:", request.method);

  // 쿠키 전달 처리
  // 프론트는 HttpOnly 쿠키 기반 인증을 사용하므로
  // 프록시가 Cookie 헤더를 직접 백엔드로 전달해야 한다
  const cookies = request.cookies.getAll();
  const cookieHeader = cookies.map(c => `${c.name}=${c.value}`).join("; ");

  // 헤더 구성
  // Content-Type을 기본값으로 강제 지정하면 안 된다
  // multipart/form-data 요청에서 boundary가 깨질 수 있기 때문이다
  // 요청에 Content-Type이 있으면 그대로 전달만 한다
  const headers: HeadersInit = {};

  const contentType = request.headers.get("content-type");
  if (contentType) {
    headers["Content-Type"] = contentType;
  }

  if (cookieHeader) {
    headers["Cookie"] = cookieHeader;
  }

  // body 처리
  // request.body는 ReadableStream이다
  // text()나 json()으로 읽으면 multipart 업로드가 깨진다
  // 따라서 body를 그대로 fetch에 전달한다
  // GET, HEAD 요청은 body를 가지면 안 되므로 undefined 처리
  const body =
    request.method === "GET" || request.method === "HEAD"
      ? undefined
      : request.body;

  // 백엔드로 실제 요청 전달
  // Node.js fetch는 stream body를 보낼 경우
  // duplex 옵션을 반드시 요구한다
  const response = await fetch(targetUrl, {
    method: request.method,
    headers,
    body,
    duplex: body ? "half" : undefined,
    credentials: "include",
  });

  console.log("RESPONSE STATUS:", response.status);

  // 204 No Content 처리
  // 토큰 갱신 같은 경우 body가 없으므로
  // response.text()를 호출하면 안 된다
  if (response.status === 204) {
    const result = new NextResponse(null, { status: 204 });

    // 백엔드에서 내려준 Set-Cookie를 그대로 전달
    const setCookieHeaders = response.headers.getSetCookie?.() || [];
    setCookieHeaders.forEach(cookie => {
      result.headers.append("Set-Cookie", cookie);
    });

    console.log("========== END PROXY ==========\n");
    return result;
  }

  // 일반 응답 처리
  // GraphQL, REST JSON 응답 모두 문자열로 받아서 그대로 전달한다
  const responseBody = await response.text();

  const result = new NextResponse(responseBody, {
    status: response.status,
    headers: {
      "Content-Type":
        response.headers.get("content-type") || "application/json",
    },
  });

  // Set-Cookie 전달
  const setCookieHeaders = response.headers.getSetCookie?.() || [];
  setCookieHeaders.forEach(cookie => {
    result.headers.append("Set-Cookie", cookie);
  });

  console.log("========== END PROXY ==========\n");
  return result;
}

// HTTP 메서드별 엔트리 포인트
// 모든 요청은 동일한 proxy 함수로 처리한다
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
