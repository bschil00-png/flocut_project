"use client";

import { useSelector } from "react-redux";
import { RootState } from "@/store";
import Link from "next/link";
import { useAuthActions } from "@/hooks/useAuthActions";
import DarkModeToggle from "./DarkModeToggle";
import {useAuthState} from "@/hooks/useAuthState";



export default function HeaderClient() {
  const { isAuthenticated, user, loading } = useAuthState();
  const { logout } = useAuthActions();

  // 아직 auth.sync()가 끝나지 않았다면
  // 헤더를 렌더하지 않는다.
  if (loading) return null;

  return (
    <div className="flex items-center gap-4">
      {isAuthenticated ? (
        <>
          {user?.name && (
            <span
              className="
                text-sm font-medium
                text-text-primary-light
                dark:text-text-primary-dark
              "
            >
              {user.name}님 안녕하세요
            </span>
          )}
          <button
            onClick={logout}
            className="
              text-sm
              text-text-muted-light
              hover:text-text-primary-light
              dark:text-text-muted-dark
              dark:hover:text-text-primary-dark
            "
          >
            로그아웃
          </button>
        </>
      ) : (
        <>
          <Link
            href="/login"
            className="
              text-sm
              text-text-muted-light
              hover:text-text-primary-light
              dark:text-text-muted-dark
              dark:hover:text-text-primary-dark
            "
          >
            로그인
          </Link>

          <Link
            href="/signup"
            className="
              px-4 h-9 flex items-center rounded-md text-sm font-medium
              bg-accent hover:bg-accent-hover
              text-white
            "
          >
            회원가입
          </Link>
        </>
      )}

      <DarkModeToggle />
    </div>
  );
}

