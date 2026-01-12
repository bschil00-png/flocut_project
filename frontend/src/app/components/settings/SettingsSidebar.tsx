// src/components/settings/SettingsSidebar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { User, Palette, Shield } from "lucide-react";

const items = [
    { href: "/settings/profile", label: "프로필", icon: User },
    { href: "/settings/theme", label: "테마", icon: Palette },
    { href: "/settings/account", label: "계정", icon: Shield },
];

export default function SettingsSidebar() {
    const pathname = usePathname();

    return (
        <aside className="w-60 border-r border-border-light dark:border-border-dark p-4">
            <h2 className="mb-4 text-sm font-semibold">계정 관리</h2>
            <nav className="space-y-1">
                {items.map((item) => {
                    const Icon = item.icon;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`
                                flex items-center gap-3 px-3 py-2 rounded text-sm transition-colors
                                ${pathname === item.href
                                ? "bg-accent-soft text-accent font-medium"
                                : "hover:bg-accent-soft"
                            }
                            `}
                        >
                            <Icon size={18} />
                            <span>{item.label}</span>
                        </Link>
                    );
                })}
            </nav>
        </aside>
    );
}