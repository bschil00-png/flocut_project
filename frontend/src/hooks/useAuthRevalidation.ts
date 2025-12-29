// useAuthRevalidation.ts
"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

export function useAuthRevalidation() {
    const pathname = usePathname();
    const lastCheck = useRef(0);
    const MIN_INTERVAL = 60_000;

    //  로그인/콜백 페이지에서는 작동 금지
    const DISABLED_PATHS = [
        "/login",
        "/signup",
        "/auth/google/callback",
    ];

    const isDisabled = DISABLED_PATHS.some(p =>
        pathname.startsWith(p)
    );

    useEffect(() => {
        if (isDisabled) return;

        const handleVisibility = async () => {
            if (document.visibilityState !== "visible") return;
            if (Date.now() - lastCheck.current < MIN_INTERVAL) return;

            lastCheck.current = Date.now();

            try {
                const res = await fetch("/api/proxy/graphql", {
                    method: "POST",
                    credentials: "include",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        query: "query { me { memberId } }",
                    }),
                });

                if (!res.ok) throw new Error();
                const json = await res.json();
                if (json.errors) throw new Error();
            } catch {
                window.dispatchEvent(new Event("auth:logout"));
            }
        };

        document.addEventListener("visibilitychange", handleVisibility);
        return () =>
            document.removeEventListener("visibilitychange", handleVisibility);
    }, [isDisabled]);
}
