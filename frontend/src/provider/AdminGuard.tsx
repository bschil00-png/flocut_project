"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthState } from "@/hooks/useAuthState";

export function AdminGuard({ children }: { children: React.ReactNode }) {
  const { status, user } = useAuthState();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/login");
      return;
    }

    if (status === "authenticated" && user?.role !== "ADMIN") {
      router.replace("/403");
    }
  }, [status, user, router]);

  if (status !== "authenticated" || user?.role !== "ADMIN") {
    return null;
  }

  return <>{children}</>;
}
