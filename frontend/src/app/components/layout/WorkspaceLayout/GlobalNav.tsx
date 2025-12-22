"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Clock, Star, FileText, Users, Archive, Plus, Search, Settings, ChevronLeft, ChevronRight, Menu } from "lucide-react";

import IconButton from "@/app/components/ui/icon-button/IconButton";
import useResponsiveNav from "@/hooks/useResponsiveNav";
import { useState } from "react";

export default function GlobalNav() {
  const pathname = usePathname();
  const { isCollapsed, isMobile, setCollapsed } = useResponsiveNav();
  const [openMobile, setOpenMobile] = useState(false);

  const nav = [
    { href: "/", name: "홈", icon: Home },
    { href: "/recent", name: "최근 문서", icon: Clock },
    { href: "/favorites", name: "즐겨찾기", icon: Star },
    { href: "/notes", name: "모든 노트", icon: FileText, badge: 24 },
    { href: "/shared", name: "공유 문서", icon: Users, badge: 5 },
    { href: "/archive", name: "보관함", icon: Archive },
  ];

  // ────────────────────────────────────────────────
  // 모바일 Drawer (fixed)
  // ────────────────────────────────────────────────
  if (isMobile) {
    return (
      <>
        {/* 햄버거 버튼 - 항상 화면 상단 고정 */}
        {!openMobile && (
          <button
            onClick={() => setOpenMobile(true)}
            className="fixed top-3 left-3 z-40 p-2 rounded-md border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark"
          >
            <Menu size={20} />
          </button>
        )}

        {/* Drawer */}
        <aside
          className={`
            fixed top-0 left-0 z-50 h-full w-60
            bg-surface-light dark:bg-surface-dark
            border-r border-border-light dark:border-border-dark
            transition-transform duration-300
            ${openMobile ? "translate-x-0" : "-translate-x-full"}
          `}
        >
          {/* Drawer Header */}
          <div className="h-14 px-3 flex items-center border-b border-border-light dark:border-border-dark">
            <IconButton
              icon={<span className="text-white font-bold">F</span>}
              className="w-10 h-10 bg-accent text-white"
            />
            <span className="ml-3 font-semibold text-sm text-text-primary-light dark:text-white">
              개인 워크스페이스
            </span>

            <button
              onClick={() => setOpenMobile(false)}
              className="ml-auto p-2 rounded-md hover:bg-accent-soft"
            >
              <ChevronLeft size={20} />
            </button>
          </div>

          {/* 빠른 액션 */}
          <div className="px-3 py-3 border-b border-border-light dark:border-border-dark space-y-2">
            <button className="w-full flex items-center gap-2 px-3 py-2 rounded-md bg-accent text-white hover:bg-accent-hover text-sm">
              <Plus size={16} /> 새 노트
            </button>
            <button className="w-full flex items-center gap-2 px-3 py-2 rounded-md hover:bg-accent-soft text-sm">
              <Search size={16} /> 검색
            </button>
          </div>

          {/* Nav */}
          <nav className="px-2 py-3 space-y-1">
            {nav.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpenMobile(false)}
                  className={`
                    flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors
                    ${active ? "bg-accent-soft text-accent" : "hover:bg-accent-soft"}
                  `}
                >
                  <item.icon size={18} />
                  <span className="flex-1">{item.name}</span>
                  {item.badge && (
                    <span className="px-2 py-0.5 rounded bg-accent-soft text-accent text-xs">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="border-t border-border-light dark:border-border-dark p-2">
            <button className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-accent-soft w-full text-sm">
              <Settings size={18} />
              설정
            </button>
          </div>
        </aside>
      </>
    );
  }

  // ────────────────────────────────────────────────
  // 데스크탑 / 태블릿 (fixed 아님, flex-flow)
  // ────────────────────────────────────────────────
  return (
    <aside
      className={`
        h-screen flex-shrink-0
        bg-surface-light dark:bg-surface-dark
        border-r border-border-light dark:border-border-dark
        transition-all duration-300
        ${isCollapsed ? "w-16" : "w-60"}
      `}
    >
      {/* Header */}
      <div className="h-14 px-3 flex items-center border-b border-border-light dark:border-border-dark gap-3">
        <IconButton
          icon={<span className="text-white font-bold">F</span>}
          className="w-10 h-10 bg-accent text-white"
        />

        {!isCollapsed && (
          <span className="text-sm font-semibold truncate">
            개인 워크스페이스
          </span>
        )}
      </div>

      {/* Quick Action */}
      <div className="px-3 py-3 border-b border-border-light dark:border-border-dark">
        {!isCollapsed ? (
          <div className="space-y-2">
            <button className="w-full flex items-center gap-2 px-3 py-2 rounded-md bg-accent text-white hover:bg-accent-hover text-sm">
              <Plus size={16} /> 새 노트
            </button>
            <button className="w-full flex items-center gap-2 px-3 py-2 rounded-md hover:bg-accent-soft text-sm">
              <Search size={16} /> 검색
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-3 items-center">
            <IconButton icon={<Plus size={18} />} className="bg-accent text-white w-10 h-10" />
            <IconButton icon={<Search size={18} />} />
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-2 py-3 space-y-1">
        {nav.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`
                flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors
                ${isCollapsed ? "justify-center" : ""}
                ${active ? "bg-accent-soft text-accent" : "hover:bg-accent-soft"}
              `}
            >
              <item.icon size={18} />
              {!isCollapsed && (
                <>
                  <span className="flex-1 truncate">{item.name}</span>
                  {item.badge && (
                    <span className="px-2 py-0.5 rounded bg-accent-soft text-accent text-xs">
                      {item.badge}
                    </span>
                  )}
                </>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="border-t border-border-light dark:border-border-dark p-2 flex flex-col gap-2">
        {!isCollapsed && (
          <button className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-accent-soft text-sm">
            <Settings size={18} />
            설정
          </button>
        )}

        <IconButton
          icon={isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          onClick={() => setCollapsed(!isCollapsed)}
          className="w-10 h-10 mx-auto"
        />
      </div>
    </aside>
  );
}
