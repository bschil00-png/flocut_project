
export const apiFetch = (url: string, options?: RequestInit) => {
    return fetch(`/api/proxy${url}`, {
        credentials: "include",
        ...options,
    });
};
