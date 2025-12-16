"use client";

import Link from "next/link";
import DarkModeToggle from "./DarkModeToggle";

/**
 * Header 컴포넌트
 *
 * - SaaS 공통 레이아웃
 * - 로고 / 네비게이션 / 액션 영역 분리
 * - 컬러는 디자인 토큰만 사용
 */
export default function Header() {
  return (
    <header
      className="
    fixed top-0 z-50
    w-full
    bg-background-light/90
    dark:bg-background-dark/90
    backdrop-blur
    border-b border-border-light
    dark:border-border-dark
  "
    >

      {/* 중앙 정렬 컨테이너 */}
      <div
        className="
          mx-auto max-w-7xl
          px-6
          h-16
          flex items-center justify-between
        "
      >
        {/* ===== Left : Logo ===== */}

        <div className="flex items-center gap-2">
          <Link href="/">
            {/* 실제 서비스에서는 SVG 로고로 교체 권장 */}
          <span
          className="
          text-lg font-bold tracking-tight
          text-text-primary-light
          dark:text-text-primary-dark
          "
          >
             FLOCUT
        </span>
          </Link>
      </div>

      {/* ===== Center : Navigation ===== */}
      <nav className="hidden md:flex items-center gap-8">
        {[
          {label: "회사 소개", href: "/about"},
          {label: "요약", href: "/summary"},
          {label: "캘린더", href: "/calendar"},
          {label: "고객지원", href: "/support"},
        ].map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className="
                text-sm font-medium
                text-text-muted-light
                dark:text-text-muted-dark
                hover:text-text-primary-light
                dark:hover:text-text-primary-dark
                transition-colors
              "
          >
            {item.label}
          </Link>
        ))}
      </nav>

      {/* ===== Right : Actions ===== */}
      <div className="flex items-center gap-4">
        {/* 검색 인풋 (프론트 검색용, 나중에 기능 연결) */}
        <div className="hidden lg:block">
          <input
            type="text"
            placeholder="검색"
            className="
                h-9 w-44 rounded-md
                bg-surface-light
                dark:bg-surface-dark
                border border-border-light
                dark:border-border-dark
                px-3 text-sm
                text-text-primary-light
                dark:text-text-primary-dark
                placeholder:text-text-muted-light
                dark:placeholder:text-text-muted-dark
                focus:outline-none
                focus:ring-2 focus:ring-accent
              "
          />
        </div>

        {/* 로그인 */}
        <Link
          href="/login"
          className="
              text-sm font-medium
              text-text-muted-light
              dark:text-text-muted-dark
              hover:text-text-primary-light
              dark:hover:text-text-primary-dark
            "
        >
          로그인
        </Link>

        {/* 회원가입 (Primary CTA) */}
        <Link
          href="/signup"
          className="
    h-9 px-4
    flex items-center justify-center
    rounded-md
    bg-accent
    hover:bg-accent-hover
    text-white text-sm font-medium
    transition-colors
  "
        >
          회원가입
        </Link>


        {/* 다크모드 토글 */}
        <DarkModeToggle/>
      </div>
    </div>
</header>
)
  ;
}
