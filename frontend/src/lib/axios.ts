import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";

interface CustomAxiosInstance {
  get<T = any>(url: string, config?: AxiosRequestConfig): Promise<T>;
  post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T>;
  put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T>;
  delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<T>;
  patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T>;
}

const axiosInstance = axios.create({
  baseURL: "/api/proxy",
  withCredentials: true,
});

axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => response.data,

  async (error: AxiosError) => {
    const originalRequest: any = error.config;
    const status = error.response?.status;

    const shouldRefresh =
      (status === 401 || status === 403) &&
      !originalRequest._retry;

    if (shouldRefresh) {
      originalRequest._retry = true;

      try {
        await fetch("/api/proxy/auth/refresh", {
          method: "POST",
          credentials: "include",
        });

        // refresh 성공 후 동일 요청 재시도
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        // refresh 실패 → 완전 로그아웃
        window.dispatchEvent(new Event("member:logout"));
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export const api = axiosInstance as unknown as CustomAxiosInstance;
