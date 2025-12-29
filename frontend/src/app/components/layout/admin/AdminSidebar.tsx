// src/components/admin/layout/AdminSidebar.tsx

"use client";

import { usePathname } from "next/navigation";
import {LayoutDashboard, Users} from "lucide-react";
import Link from "next/link";

// 어드민 사이드바 메뉴 정의
// href 기준으로 active 상태 판단
const adminNavItems = [
    {
        label: "Dashboard",
        href: "/admin/dashboard",
        icon: LayoutDashboard,
    },
    {
        label: "Members",
        href: "/admin/members",
        icon: Users,
    },
];


export default function AdminSidebar() {
    const pathname = usePathname();

    return (
        <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
            {/* 브랜드 영역 */}
            <div className="px-6 py-5 border-b border-gray-200">
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-gray-900 flex items-center justify-center">
                        <span className="text-white font-bold">F</span>
                    </div>
                    <div>
                        <div className="font-semibold text-gray-900">FloCut</div>
                        <div className="text-xs text-gray-500">Admin Console</div>
                    </div>
                </div>
            </div>

            {/* 메뉴 */}
            <nav className="flex-1 px-4 py-4 space-y-1">
                {adminNavItems.map((item) => {
                    const active = pathname.startsWith(item.href);

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`
                flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium
                transition-colors
                ${
                                active
                                    ? "bg-gray-100 text-gray-900"
                                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                            }
              `}
                        >
                            <item.icon className="w-[18px] h-[18px]" />
                            {item.label}
                        </Link>
                    );
                })}
            </nav>

            {/* 하단 사용자 */}
            <div className="p-4 border-t border-gray-200">
                <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer">
                    <div className="w-9 h-9 rounded-full bg-gray-900 flex items-center justify-center">
                        <span className="text-white text-sm font-medium">A</span>
                    </div>
                    <div>
                        <div className="text-sm font-medium text-gray-900">Admin User</div>
                        <div className="text-xs text-gray-500">Super Admin</div>
                    </div>
                </div>
            </div>
        </aside>
    );
}