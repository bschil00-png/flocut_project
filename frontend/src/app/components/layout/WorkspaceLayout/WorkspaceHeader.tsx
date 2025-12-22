"use client";

import { Settings } from "lucide-react";
import Link from "next/link";
import IconButton from "@/app/components/ui/icon-button/IconButton";

export default function WorkspaceHeader() {
  return (
    <header className="
      h-14
      flex items-center justify-between
      px-4 md:px-6
      border-b border-border-light dark:border-border-dark
      bg-background-light dark:bg-background-dark
    ">

      {/* 왼쪽 - 워크스페이스 제목 */}
      <div className="flex items-center gap-3 min-w-0">
        <Link href="/" className="hover:opacity-80 transition-opacity">
          <h1 className="text-base font-semibold truncate text-text-primary-light dark:text-text-primary-dark">
            FLOCUT WORKSPACE
          </h1>
        </Link>

        <span className="text-xs text-text-muted-light dark:text-text-muted-dark hidden sm:inline">
          저장됨
        </span>
      </div>

      {/* 오른쪽 - 환경설정 / 프로필 */}
      <div className="flex items-center gap-2">

        {/* 마이페이지 (프로필) */}
        {/*  모달 창으로 */}
        <Link
          href="/profile"
          className="
            w-8 h-8 rounded-full bg-accent
            text-white flex items-center justify-center text-sm font-semibold
            hover:opacity-90 transition
          "
        >
          F
        </Link>
      </div>
    </header>
  );
}
