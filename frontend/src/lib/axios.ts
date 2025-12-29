import axios, { AxiosError } from "axios";

export const api = axios.create({
    baseURL: "/api/proxy",
    withCredentials: true,
});

api.interceptors.response.use(
    (response) => response.data,

    async (error: AxiosError) => {
        const originalRequest: any = error.config;
        const status = error.response?.status;

        if (status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                await fetch("/api/proxy/auth/refresh", {
                    method: "POST",
                    credentials: "include",
                });

                return api(originalRequest);
            } catch {
                window.dispatchEvent(new Event("auth:logout"));
                return Promise.reject(error);
            }
        }

        return Promise.reject(error);
    }
);
