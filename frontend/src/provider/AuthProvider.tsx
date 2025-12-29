// src/provider/AuthProvider.tsx
"use client";

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { clearAuth } from "@/store/slice/authSlice";
import { useRouter, usePathname } from "next/navigation";
import { isProtectedPath } from "@/config/auth.config";

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const dispatch = useDispatch();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        const handleLogout = () => {
            dispatch(clearAuth());

            if (isProtectedPath(pathname)) {
                router.replace("/login");
            }
        };

        window.addEventListener("auth:logout", handleLogout);
        return () => window.removeEventListener("auth:logout", handleLogout);
    }, [dispatch, router, pathname]);

    return <>{children}</>;
}
