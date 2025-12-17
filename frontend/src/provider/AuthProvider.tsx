"use client";

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setAuthUser, clearAuth } from "@/store/slice/authSlice";
import { getMe } from "@/lib/auth";

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const dispatch = useDispatch();

    useEffect(() => {
        getMe()
            .then((user) => {
                dispatch(
                    setAuthUser({
                        memberId: user.memberId,
                        email: user.email,
                        name: user.name,
                    })
                );
            })
            .catch(() => {
                dispatch(clearAuth());
            });
    }, []);



    return <>{children}</>;
}
