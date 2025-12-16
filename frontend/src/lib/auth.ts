import { apiFetch } from "./http";
import {MeResponse} from "@/app/api/auth/auth.types";

export async function login(email: string, password: string) {
    const res = await fetch("http://localhost:8080/auth/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
        throw new Error("Login failed");
    }

    return res.json();
}

export async function getMe(): Promise<MeResponse> {
    return apiFetch("/auth/me");
}
export async function logout() {
    // 지금은 서버 logout API 없으니
    // Redux clearAuth만 하면 됨
}
