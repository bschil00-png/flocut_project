// src/lib/http.ts

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL!;

/**
 * 공통 fetch 래퍼 (REST)
 */
export async function apiFetch<T>(
    url: string,
    options: RequestInit = {}
): Promise<T> {
    const res = await fetch(`${API_BASE_URL}${url}`, {
        ...options,
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
            ...(options.headers || {}),
        },
    });

    if (!res.ok) {
        throw new Error(await res.text());
    }

    return res.json();
}
