// src/app/api/proxy/[...path]/route.ts

import { NextRequest, NextResponse } from "next/server";

const BACKEND_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL!;

async function proxy(request: NextRequest) {
    const { pathname, search } = new URL(request.url);

    let targetPath = pathname.replace("/api/proxy", "");
    targetPath = targetPath.replace(/\/+/g, "/");

    if (!targetPath.startsWith("/")) {
        targetPath = "/" + targetPath;
    }

    const cleanBaseUrl = BACKEND_BASE_URL.replace(/\/+$/, "");
    const targetUrl = `${cleanBaseUrl}${targetPath}${search}`;

    console.log("\n========== PROXY REQUEST ==========");
    console.log("TARGET URL:", targetUrl);
    console.log("METHOD:", request.method);

    const cookies = request.cookies.getAll();
    const cookieHeader = cookies.map(c => `${c.name}=${c.value}`).join("; ");

    const headers: HeadersInit = {};

    const contentType = request.headers.get("content-type");
    if (contentType) {
        headers["Content-Type"] = contentType;
    }

    if (cookieHeader) {
        headers["Cookie"] = cookieHeader;
    }

    const body =
        request.method === "GET" || request.method === "HEAD"
            ? undefined
            : request.body;

    const response = await fetch(targetUrl, {
        method: request.method,
        headers,
        body,
        ...(body ? ({ duplex: "half" } as any) : {}),
        credentials: "include",
    });

    console.log("========== BACKEND RESPONSE ==========");
    console.log("STATUS:", response.status);
    console.log("HEADERS:", Object.fromEntries(response.headers));

    if (response.status === 204) {
        const result = new NextResponse(null, { status: 204 });

        const setCookieHeaders = response.headers.getSetCookie?.() || [];
        setCookieHeaders.forEach(cookie => {
            result.headers.append("Set-Cookie", cookie);
        });

        console.log("========== END PROXY (204) ==========\n");
        return result;
    }

    const responseBody = await response.text();

    //  body 로그 추가
    console.log("BODY:", responseBody);
    console.log("========== END PROXY ==========\n");

    const result = new NextResponse(responseBody, {
        status: response.status,
        headers: {
            "Content-Type":
                response.headers.get("content-type") || "application/json",
        },
    });

    const setCookieHeaders = response.headers.getSetCookie?.() || [];
    setCookieHeaders.forEach(cookie => {
        result.headers.append("Set-Cookie", cookie);
    });

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