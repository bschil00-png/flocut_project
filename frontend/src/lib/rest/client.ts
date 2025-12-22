// src/lib/rest/client.ts

// 단순 REST 호출용 
export async function restClient<T>(
    url: string,
    options: RequestInit = {}
): Promise<T> {
    const res = await fetch(`/api/proxy${url}`, {
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
            ...(options.headers || {}),
        },
        ...options,
    });

    if (!res.ok) throw new Error(await res.text());
    return res.json();
}
