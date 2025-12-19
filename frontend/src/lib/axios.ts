import axios from "axios";

// ✔ 모든 REST 요청은 이 인스턴스만 사용
export const api = axios.create({
    baseURL: "/api/proxy",
    withCredentials: true,
});

api.interceptors.response.use(
    (res) => res.data,
    (err) => Promise.reject(err)
);
