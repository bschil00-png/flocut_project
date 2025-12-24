"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
    { href: "/settings/profile", label: "프로필" },
    { href: "/settings/theme", label: "테마" },
    { href: "/settings/account", label: "계정" },
];

export default function SettingsSidebar() {
    const pathname = usePathname();

    return (
        <aside className="w-60 border-r border-border-light p-4">
            <h2 className="mb-4 text-sm font-semibold">설정</h2>
            <nav className="space-y-1">
                {items.map((item) => (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={`block px-3 py-2 rounded text-sm
              ${pathname === item.href ? "bg-accent-soft text-accent" : "hover:bg-accent-soft"}
            `}
                    >
                        {item.label}
                    </Link>
                ))}
            </nav>
        </aside>
    );
}
