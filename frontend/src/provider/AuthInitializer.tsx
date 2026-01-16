"use client";

import { useEffect, useRef } from "react";
import { useAuthActions } from "@/hooks/useAuthActions";

// 앱 최초 마운트 시 인증 상태 확인
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
