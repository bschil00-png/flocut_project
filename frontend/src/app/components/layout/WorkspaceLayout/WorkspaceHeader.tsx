"use client";

import { useRouter, usePathname } from "next/navigation";
import { Search, Bell, ChevronRight, Home } from "lucide-react";
import { useState } from "react";

export default function WorkspaceHeader() {
  const router = useRouter();
  const pathname = usePathname();

  // 검색창 입력값
  const [searchQuery, setSearchQuery] = useState("");

  // 알림 개수 (임시)
  const notificationCount = 3;

  // 현재 경로를 기반으로 Breadcrumb 생성
  // 예: /workspace/123 → ["홈", "워크스페이스", "세션 #123"]
  const getBreadcrumbs = () => {
    const paths = pathname.split("/").filter(Boolean);
    const breadcrumbs: Array<{ label: string; href: string }> = [];

    // 항상 홈은 첫 번째
    breadcrumbs.push({ label: "홈", href: "/" });

    if (paths[0] === "workspace") {
      breadcrumbs.push({ label: "워크스페이스", href: "/workspace" });

      // 세션 ID가 있으면 추가
      if (paths[1] && !isNaN(Number(paths[1]))) {
        breadcrumbs.push({
          label: `세션 #${paths[1]}`,
          href: `/workspace/${paths[1]}`,
        });
      }

      // 노트/문서 상세인 경우
      if (paths[2] === "notes" && paths[3]) {
        breadcrumbs.push({
          label: paths[3] === "new" ? "새 노트" : `노트`,
          href: pathname,
        });
      }
    }

    return breadcrumbs;
  };

  const breadcrumbs = getBreadcrumbs();

  // 검색 실행 (Enter 키)
  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <header className="
      h-14 flex-shrink-0
      border-b border-border-light dark:border-border-dark
      bg-white dark:bg-background-dark
      flex items-center justify-between
      px-4 sm:px-6
    ">
      {/* 왼쪽: Breadcrumb 네비게이션 */}
      <div className="flex items-center gap-2 flex-1 min-w-0">
        {/* 홈 아이콘 버튼 */}
        <button
          onClick={() => router.push("/")}
          className="
            p-2 rounded-lg
            text-text-muted-light dark:text-text-muted-dark
            hover:bg-surface-light dark:hover:bg-surface-hover
            hover:text-text-primary-light dark:hover:text-text-primary-dark
            transition-all duration-200
          "
          aria-label="홈으로 이동"
        >
          <Home size={18} />
        </button>

        {/* Breadcrumb 경로 */}
        <nav className="hidden sm:flex items-center gap-1 text-sm overflow-x-auto">
          {breadcrumbs.map((crumb, index) => (
            <div key={crumb.href} className="flex items-center gap-1 flex-shrink-0">
              {/* 구분자 (첫 번째 제외) */}
              {index > 0 && (
                <ChevronRight
                  size={14}
                  className="text-text-muted-light dark:text-text-muted-dark"
                />
              )}

              {/* Breadcrumb 아이템 */}
              <button
                onClick={() => router.push(crumb.href)}
                className={`
                  px-2 py-1 rounded-md
                  transition-all duration-200
                  ${
                  index === breadcrumbs.length - 1
                    ? "text-text-primary-light dark:text-text-primary-dark font-medium"
                    : "text-text-muted-light dark:text-text-muted-dark hover:bg-surface-light dark:hover:bg-surface-hover hover:text-text-primary-light dark:hover:text-text-primary-dark"
                }
                `}
              >
                {crumb.label}
              </button>
            </div>
          ))}
        </nav>
      </div>

      {/* 중앙: 검색창 (태블릿 이상) */}
      <div className="hidden md:flex items-center flex-1 max-w-md mx-4">
        <div className="relative w-full">
          {/* 검색 아이콘 */}
          <Search
            size={16}
            className="
              absolute left-3 top-1/2 -translate-y-1/2
              text-text-muted-light dark:text-text-muted-dark
              pointer-events-none
            "
          />

          {/* 검색 입력창 */}
          <input
            type="text"
            placeholder="검색..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleSearch}
            className="
              w-full h-9 pl-9 pr-12
              rounded-lg border border-border-light dark:border-border-dark
              bg-surface-light dark:bg-surface-input
              text-sm text-text-primary-light dark:text-text-primary-dark
              placeholder:text-text-muted-light dark:placeholder:text-text-muted-dark
              focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent
              hover:border-accent
              transition-all duration-200
            "
          />

          {/* 검색 단축키 표시 (데스크톱만) */}
          <kbd className="
            hidden lg:inline-flex
            absolute right-2 top-1/2 -translate-y-1/2
            items-center gap-1 px-2 py-0.5
            text-xs text-text-muted-light dark:text-text-muted-dark
            bg-white dark:bg-surface-hover
            rounded border border-border-light dark:border-border-dark
          ">
            ⌘K
          </kbd>
        </div>
      </div>

      {/* 오른쪽: 알림 & 프로필 */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* 검색 버튼 (모바일 전용) */}
        <button
          className="
            md:hidden p-2 rounded-lg
            text-text-muted-light dark:text-text-muted-dark
            hover:bg-surface-light dark:hover:bg-surface-hover
            hover:text-text-primary-light dark:hover:text-text-primary-dark
            transition-all duration-200
          "
          aria-label="검색"
        >
          <Search size={18} />
        </button>

        {/* 알림 버튼 */}
        <button
          className="
            relative p-2 rounded-lg
            text-text-muted-light dark:text-text-muted-dark
            hover:bg-surface-light dark:hover:bg-surface-hover
            hover:text-text-primary-light dark:hover:text-text-primary-dark
            transition-all duration-200
          "
          aria-label="알림"
        >
          <Bell size={18} />

          {/* 알림 뱃지 */}
          {notificationCount > 0 && (
            <span className="
              absolute top-1 right-1
              w-2 h-2
              bg-red-500 rounded-full
              ring-2 ring-white dark:ring-background-dark
            " />
          )}
        </button>

        {/* 프로필 버튼 */}
        <button
          onClick={() => router.push("/settings/profile")}
          className="
            w-8 h-8 rounded-lg
            bg-gradient-to-br from-pink-500 to-violet-500
            text-white font-semibold text-sm
            flex items-center justify-center
            hover:shadow-lg hover:scale-105
            transition-all duration-200
          "
          aria-label="프로필 설정"
        >
          F
        </button>
      </div>
    </header>
  );
}