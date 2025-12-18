// src/lib/api.ts
// 프론트에서 무조건 api/proxy 로 호출
export const apiFetch = (url: string, options?: RequestInit) => {
    return fetch(`/api/proxy${url}`, {
        credentials: "include",
        ...options,
    });
};
