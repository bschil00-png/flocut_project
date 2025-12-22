// src/app/(workspace)/layout.tsx
"use client";

import "@/app/globals.css";
import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuthActions } from "@/hooks/useAuthActions";

import GlobalNav from "@/app/components/layout/WorkspaceLayout/GlobalNav";
import WorkspaceHeader from "@/app/components/layout/WorkspaceLayout/WorkspaceHeader";

export default function WorkspaceLayout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  const { logout, ensureAuth } = useAuthActions();

  //  마운트 시 1번만 인증 체크
  useEffect(() => {
    let isMounted = true;

    const checkAuth = async () => {
      const isAuthenticated = await ensureAuth();

      if (!isMounted) return;

      if (!isAuthenticated) {
        router.replace(`/login?from=${pathname}`);
      }

      setIsChecking(false);
    };

    checkAuth();

    return () => {
      isMounted = false;
    };
  }, []); // 빈 배열로 변경

  // 로그아웃 이벤트 리스너
  useEffect(() => {
    const handleLogout = () => {
      logout().then(() => {
        router.replace("/login");
      });
    };

    window.addEventListener("auth:logout", handleLogout);
    return () => window.removeEventListener("auth:logout", handleLogout);
  }, [logout, router]);

  // 인증 확인 중 로딩
  if (isChecking) {
    return (
      <div className="h-screen flex items-center justify-center bg-background-light dark:bg-background-dark">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 dark:border-white mx-auto"></div>
          <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
            인증 확인 중...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-background-light dark:bg-background-dark">
      <WorkspaceHeader />

      <div className="flex-1 flex overflow-hidden">
        <GlobalNav
          collapsed={collapsed}
          onToggleCollapse={() => setCollapsed(!collapsed)}
        />

        <main className="flex-1 overflow-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}