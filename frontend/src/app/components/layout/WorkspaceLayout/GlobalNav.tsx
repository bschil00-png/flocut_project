// components/layout/WorkspaceLayout/GlobalNav.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    Home,
    FileText,
    FolderOpen,
    Archive,
    Settings,
    ChevronLeft,
    ChevronRight,
    Plus,
    Search,
    Sparkles,
    Clock,
    Star,
    Users,
} from "lucide-react";

interface GlobalNavProps {
    collapsed: boolean;
    onToggleCollapse: () => void;
}

export default function GlobalNav({
                                      collapsed,
                                      onToggleCollapse,
                                  }: GlobalNavProps) {
    const pathname = usePathname();
    const [workspaces] = useState([
        { id: "personal", name: "개인 워크스페이스", icon: "F" },
        { id: "team", name: "팀 프로젝트", icon: "T" },
    ]);
    const [currentWorkspace, setCurrentWorkspace] = useState("personal");

    const navigation = [
        { name: "홈", href: "/", icon: Home, badge: null },
        { name: "최근 문서", href: "/recent", icon: Clock, badge: null },
        { name: "즐겨찾기", href: "/favorites", icon: Star, badge: null },
        { name: "모든 노트", href: "/notes", icon: FileText, badge: 24 },
        { name: "공유 문서", href: "/shared", icon: Users, badge: 5 },
        { name: "보관함", href: "/archive", icon: Archive, badge: null },
    ];

    const aiFeatures = [
        { name: "AI 요약", icon: Sparkles, action: "summary" },
        { name: "문서 비교", icon: FolderOpen, action: "compare" },
    ];

    return (
        <aside
            className={`
        relative border-r border-border-light dark:border-border-dark 
        bg-surface-light dark:bg-surface-dark flex flex-col
        transition-all duration-300 ease-in-out
        ${collapsed ? "w-16" : "w-60"}
      `}
        >
            {/* 워크스페이스 선택 */}
            <div className="h-12 px-3 flex items-center border-b border-border-light dark:border-border-dark">
                {!collapsed ? (
                    <button
                        onClick={() => {
                            // 워크스페이스 전환 모달 열기
                        }}
                        className="flex items-center gap-2 flex-1 hover:bg-surface-hover dark:hover:bg-surface-input rounded-md px-2 py-1.5 transition-colors"
                    >
                        <div className="w-6 h-6 rounded bg-accent flex items-center justify-center flex-shrink-0">
              <span className="text-white text-xs font-bold">
                {workspaces.find((w) => w.id === currentWorkspace)?.icon}
              </span>
                        </div>
                        <span className="text-sm font-semibold text-text-primary-light dark:text-text-primary-dark truncate">
              {workspaces.find((w) => w.id === currentWorkspace)?.name}
            </span>
                        <ChevronRight size={14} className="ml-auto flex-shrink-0" />
                    </button>
                ) : (
                    <button
                        onClick={() => {
                            // 워크스페이스 전환 모달
                        }}
                        className="w-10 h-10 mx-auto rounded bg-accent flex items-center justify-center"
                    >
            <span className="text-white text-sm font-bold">
              {workspaces.find((w) => w.id === currentWorkspace)?.icon}
            </span>
                    </button>
                )}
            </div>

            {/* 빠른 액션 */}
            <div className="px-3 py-3 border-b border-border-light dark:border-border-dark">
                {!collapsed ? (
                    <div className="space-y-1">
                        <button className="w-full flex items-center gap-2 px-3 py-2 rounded-md bg-accent hover:bg-accent-hover text-white transition-colors text-sm font-medium">
                            <Plus size={16} />
                            새 노트
                        </button>
                        <button className="w-full flex items-center gap-2 px-3 py-2 rounded-md hover:bg-surface-hover dark:hover:bg-surface-input text-text-primary-light dark:text-text-primary-dark transition-colors text-sm">
                            <Search size={16} />
                            검색
                        </button>
                    </div>
                ) : (
                    <div className="flex flex-col gap-1">
                        <button className="w-10 h-10 mx-auto rounded-md bg-accent hover:bg-accent-hover text-white flex items-center justify-center">
                            <Plus size={18} />
                        </button>
                        <button className="w-10 h-10 mx-auto rounded-md hover:bg-surface-hover dark:hover:bg-surface-input text-text-primary-light dark:text-text-primary-dark flex items-center justify-center">
                            <Search size={18} />
                        </button>
                    </div>
                )}
            </div>

            {/* 메인 네비게이션 */}
            <nav className="flex-1 overflow-y-auto px-2 py-3">
                <div className="space-y-0.5">
                    {navigation.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`
                  flex items-center gap-3 px-3 py-2 rounded-md transition-colors
                  ${
                                    isActive
                                        ? "bg-accent-soft text-accent"
                                        : "text-text-primary-light dark:text-text-primary-dark hover:bg-surface-hover dark:hover:bg-surface-input"
                                }
                  ${collapsed ? "justify-center" : ""}
                `}
                            >
                                <item.icon size={18} className="flex-shrink-0" />
                                {!collapsed && (
                                    <>
                                        <span className="text-sm flex-1 truncate">{item.name}</span>
                                        {item.badge && (
                                            <span className="text-xs px-1.5 py-0.5 rounded bg-surface-hover dark:bg-surface-input text-text-muted-light dark:text-text-muted-dark">
                        {item.badge}
                      </span>
                                        )}
                                    </>
                                )}
                            </Link>
                        );
                    })}
                </div>

                {/* AI 기능 섹션 */}
                {!collapsed && (
                    <div className="mt-6">
                        <div className="px-3 mb-2">
                            <p className="text-xs font-semibold text-text-muted-light dark:text-text-muted-dark uppercase tracking-wider">
                                AI 기능
                            </p>
                        </div>
                        <div className="space-y-0.5">
                            {aiFeatures.map((item) => (
                                <button
                                    key={item.name}
                                    className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-text-primary-light dark:text-text-primary-dark hover:bg-surface-hover dark:hover:bg-surface-input transition-colors"
                                >
                                    <item.icon size={18} />
                                    <span className="text-sm">{item.name}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </nav>

            {/* 하단: 설정 & 접기 */}
            <div className="border-t border-border-light dark:border-border-dark p-2">
                <div className="flex items-center gap-1">
                    <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-md hover:bg-surface-hover dark:hover:bg-surface-input text-text-primary-light dark:text-text-primary-dark transition-colors">
                        <Settings size={18} />
                        {!collapsed && <span className="text-sm">설정</span>}
                    </button>
                    <button
                        onClick={onToggleCollapse}
                        className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-surface-hover dark:hover:bg-surface-input text-text-muted-light dark:text-text-muted-dark transition-colors"
                    >
                        {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
                    </button>
                </div>
            </div>
        </aside>
    );
}