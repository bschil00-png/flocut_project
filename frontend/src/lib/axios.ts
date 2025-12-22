// src/lib/axios.ts
import axios, { AxiosError } from "axios";

export const api = axios.create({
  baseURL: "/api/proxy",
  withCredentials: true,
});

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any = null) => {
  console.log(` Processing queue (${failedQueue.length} items)`);
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve();
    }
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => {
    console.log("Success:", response.config.url);
    return response.data;
  },

  async (error: AxiosError) => {
    const originalRequest: any = error.config;

    if (!error.response) {
      console.log("Network error");
      return Promise.reject(error);
    }

    const status = error.response.status;
    const requestUrl = originalRequest?.url ?? "";

    console.log("Axios Error:", {
      url: requestUrl,
      status,
      _retry: originalRequest._retry,
      isRefreshing
    });

    //  /auth/refresh는 인터셉터에서 제외
    if (requestUrl.includes("/auth/refresh")) {
      console.log(" Refresh endpoint failed");
      return Promise.reject(error);
    }

    // /auth/me도 일반적인 401 처리 (refresh 시도)
    if (status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        console.log("Already refreshing, queueing");
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => api(originalRequest))
          .catch((err) => Promise.reject(err));
      }

      console.log("Starting refresh...");
      originalRequest._retry = true;
      isRefreshing = true;

      try {
        console.log(" POST /auth/refresh");
        await api.post("/auth/refresh");
        console.log(" Refresh 성공");

        processQueue();
        isRefreshing = false;

        console.log("재시도:", requestUrl);
        return api(originalRequest);
      } catch (refreshError) {
        console.log(" Refresh 실패");
        processQueue(refreshError);
        isRefreshing = false;

        window.dispatchEvent(new Event("auth:logout"));
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);
