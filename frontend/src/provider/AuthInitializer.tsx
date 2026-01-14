"use client";

import { useEffect, useRef } from "react";
import { useAuthActions } from "@/hooks/useAuthActions";

export default function AuthInitializer() {
    const { ensureAuth } = useAuthActions();
    const initialized = useRef(false);

    useEffect(() => {
        if (initialized.current) return;
        initialized.current = true;

        ensureAuth();
    }, [ensureAuth]);

    return null;
}