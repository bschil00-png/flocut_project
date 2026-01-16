"use client";

import Link from "next/link";
import { User, Palette, Shield } from "lucide-react";

const items = [
    { href: "/settings/profile", label: "프로필", icon: User },
    { href: "/settings/theme", label: "테마", icon: Palette },
    { href: "/settings/account", label: "계정", icon: Shield },
];

export default function SettingsMenuMobile() {
    return (
        <div className="space-y-2">
            <h2 className="text-lg font-bold mb-4">설정</h2>

            {items.map(item => {
                const Icon = item.icon;
                return (
                    <Link
                        key={item.href}
                        href={item.href}
                        className="flex items-center gap-3 p-4 rounded-lg border border-border-light"
                    >
                        <Icon size={18} />
                        <span className="font-medium">{item.label}</span>
                    </Link>
                );
            })}
        </div>
    );
}
