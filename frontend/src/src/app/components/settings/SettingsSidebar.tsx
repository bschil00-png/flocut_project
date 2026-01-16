"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { User, Palette, Shield, LogOut } from "lucide-react";
import { useState } from "react";

import { useAuthActions } from "@/hooks/useAuthActions";
import ConfirmDialog from "@/app/components/ui/modal/ConfirmDialog";
import AlertDialog from "@/app/components/ui/modal/AlertDialog";

const items = [
    { href: "/settings/profile", label: "프로필", icon: User },
    { href: "/settings/theme", label: "테마", icon: Palette },
    { href: "/settings/account", label: "계정", icon: Shield },
];

export default function SettingsSidebar() {
    const pathname = usePathname();
    const router = useRouter();
    const { logout } = useAuthActions();

    const [confirmOpen, setConfirmOpen] = useState(false);
    const [alertOpen, setAlertOpen] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");

    const handleLogout = async () => {
        try {
            await logout();
            router.replace("/");
        } catch {
            setAlertMessage("로그아웃에 실패했습니다. 다시 시도해주세요.");
            setAlertOpen(true);
        }
    };

    return (
        <>
            <aside className="w-60 border-r border-border-light dark:border-border-dark p-4 flex flex-col">
                <h2 className="mb-4 text-sm font-semibold">계정 관리</h2>

                <nav className="space-y-1 flex-1">
                    {items.map((item) => {
                        const Icon = item.icon;
                        const active = pathname === item.href;

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`
                  flex items-center gap-3 px-3 py-2 rounded text-sm transition-colors
                  ${active
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

                {/* 로그아웃 */}
                <button
                    onClick={() => setConfirmOpen(true)}
                    className="
            mt-4
            flex items-center gap-3 px-3 py-2 rounded
            text-sm text-text-muted-light dark:text-text-muted-dark
            hover:bg-red-500/10 hover:text-red-500
            transition-colors
          "
                >
                    <LogOut size={18} />
                    로그아웃
                </button>
            </aside>

            {/* 로그아웃 확인 */}
            <ConfirmDialog
                open={confirmOpen}
                title="로그아웃"
                message="정말 로그아웃 하시겠습니까?"
                confirmText="로그아웃"
                onConfirm={handleLogout}
                onClose={() => setConfirmOpen(false)}
            />

            {/* 에러 알림 */}
            <AlertDialog
                open={alertOpen}
                title="오류"
                message={alertMessage}
                onClose={() => setAlertOpen(false)}
            />
        </>
    );
}
