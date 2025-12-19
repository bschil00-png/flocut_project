import { NextRequest, NextResponse } from "next/server";

const BACKEND_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL!;

async function proxy(request: NextRequest) {
  const { pathname, search } = new URL(request.url);

  // /api/proxy/auth/login -> /auth/login
  const targetPath = pathname.replace("/api/proxy", "");
  const targetUrl = `${BACKEND_BASE_URL}${targetPath}${search}`;

  console.log("PROXY ROUTE HIT");
  console.log("TARGET URL:", targetUrl);

  const response = await fetch(targetUrl, {
    method: request.method,
    headers: request.headers,
    body:
      request.method === "GET" || request.method === "HEAD"
        ? undefined
        : request.body,
    duplex: "half", // 이것이 핵심
    credentials: "include",
  });

  return new NextResponse(response.body, {
    status: response.status,
    headers: response.headers,
  });
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
