"use client";

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { clearAuth } from "@/store/slice/authSlice";
import { useRouter, usePathname } from "next/navigation";
import { isProtectedPath } from "@/config/auth.config";
import {setColorTheme} from "@/store/slice/uislice";
import {resetColorTheme} from "@/lib/theme/colorTheme";


export function AuthProvider({ children }: { children: React.ReactNode }) {
    const dispatch = useDispatch();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        const handleLogout = () => {
            dispatch(clearAuth());
            dispatch(setColorTheme("pink"));
            resetColorTheme();

            if (isProtectedPath(pathname)) {
                router.replace("/login");
            }
        };

        window.addEventListener("member:logout", handleLogout);
        return () => window.removeEventListener("member:logout", handleLogout);
    }, [dispatch, router, pathname]);

    return <>{children}</>;
}
