import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";

// interceptor로 인해 response.data를 직접 반환하는 커스텀 인스턴스 타입
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

    if (status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        await fetch("/api/proxy/auth/refresh", {
          method: "POST",
          credentials: "include",
        });

        return axiosInstance(originalRequest);
      } catch {
        window.dispatchEvent(new Event("member:logout"));
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  }
);

export const api = axiosInstance as unknown as CustomAxiosInstance;