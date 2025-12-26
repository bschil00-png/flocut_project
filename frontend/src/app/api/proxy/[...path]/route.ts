// src/app/api/proxy/[...path]/route.ts
import { NextRequest, NextResponse } from "next/server";

const BACKEND_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL!;

async function proxy(request: NextRequest) {
  const { pathname, search } = new URL(request.url);

  // /api/proxy/auth/login -> /auth/login
  let targetPath = pathname.replace("/api/proxy", "");

  // 더블 슬래시 제거
  targetPath = targetPath.replace(/\/+/g, "/");

  // 맨 앞에 슬래시가 없으면 추가
  if (!targetPath.startsWith("/")) {
    targetPath = "/" + targetPath;
  }

  // BACKEND_BASE_URL 끝의 슬래시 제거
  const cleanBaseUrl = BACKEND_BASE_URL.replace(/\/+$/, "");
  const targetUrl = `${cleanBaseUrl}${targetPath}${search}`;

  console.log("\n========== PROXY REQUEST ==========");
  console.log("TARGET URL:", targetUrl);
  console.log("METHOD:", request.method);

  // 쿠키 헤더 생성
  const cookies = request.cookies.getAll();
  const cookieHeader = cookies.map(c => `${c.name}=${c.value}`).join("; ");

  console.log("REQUEST COOKIES:", cookies);
  console.log("COOKIE HEADER:", cookieHeader);

  // 필요한 헤더만 전달
  const headers: HeadersInit = {
    "Content-Type": request.headers.get("content-type") || "application/json",
  };

  if (cookieHeader) {
    headers["Cookie"] = cookieHeader;
  }

  // body 처리
  let body: string | undefined;
  if (request.method !== "GET" && request.method !== "HEAD") {
    body = await request.text();
    console.log("REQUEST BODY:", body);
  }

  // 백엔드 요청
  const response = await fetch(targetUrl, {
    method: request.method,
    headers,
    body,
    credentials: "include",
  });

  console.log("RESPONSE STATUS:", response.status);

  // 204 No Content 처리 (핵심)
  if (response.status === 204) {
    const result = new NextResponse(null, {
      status: 204,
    });

    // Set-Cookie 전달
    const setCookieHeaders = response.headers.getSetCookie?.() || [];
    console.log("SET-COOKIE FROM BACKEND:", setCookieHeaders);

    setCookieHeaders.forEach(cookie => {
      result.headers.append("Set-Cookie", cookie);
      console.log(" FORWARDING SET-COOKIE:", cookie);
    });

    console.log("========== END PROXY ==========\n");
    return result;
  }
  //
  // 그 외 상태 코드 → body 포함
  const responseBody = await response.text();
  console.log("RESPONSE BODY:", responseBody);

  const result = new NextResponse(responseBody, {
    status: response.status,
    headers: {
      "Content-Type":
        response.headers.get("content-type") || "application/json",
    },
  });

  // Set-Cookie 전달
  const setCookieHeaders = response.headers.getSetCookie?.() || [];
  console.log("SET-COOKIE FROM BACKEND:", setCookieHeaders);

  if (setCookieHeaders.length > 0) {
    setCookieHeaders.forEach(cookie => {
      result.headers.append("Set-Cookie", cookie);
      console.log(" FORWARDING SET-COOKIE:", cookie);
    });
  } else {
    console.log("NO SET-COOKIE HEADERS");
  }

  console.log("========== END PROXY ==========\n");
  return result;
}

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
