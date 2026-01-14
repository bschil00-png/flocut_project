"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useRouter, usePathname } from "next/navigation";
import { User, Palette, Shield, LogOut } from "lucide-react";
import ModalOverlay from "@/app/components/ui/modal/ModalOverlay";
import { useAuthActions } from "@/hooks/useAuthActions";
import ConfirmDialog from "@/app/components/ui/modal/ConfirmDialog";
import AlertDialog from "@/app/components/ui/modal/AlertDialog";
import { useState } from "react";

const ITEMS = [
    { href: "/settings/profile", label: "프로필", icon: User },
    { href: "/settings/theme", label: "테마", icon: Palette },
    { href: "/settings/account", label: "계정", icon: Shield },
];

export default function SettingsMobileDrawer({
                                                 open,
                                                 onClose,
                                             }: {
    open: boolean;
    onClose: () => void;
}) {
    const router = useRouter();
    const pathname = usePathname();
    const { logout } = useAuthActions();

    const [confirmOpen, setConfirmOpen] = useState(false);
    const [alertOpen, setAlertOpen] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");

    const handleLogoutConfirm = async () => {
        try {
            await logout();
            router.replace("/");
        } catch {
            setAlertMessage("로그아웃에 실패했습니다.");
            setAlertOpen(true);
        }
    };

    return (
        <>
            <AnimatePresence>
                {open && (
                    <>
                        {/*<ModalOverlay onClose={onClose} />*/}

                        <motion.aside
                            initial={{ x: "-100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "-100%" }}
                            transition={{ duration: 0.2, ease: "easeOut" }}
                            className="
                                fixed inset-y-0 left-0 z-50
                                w-64
                                bg-background-light dark:bg-surface-dark
                                border-r border-border-light dark:border-border-dark
                                p-4
                            "
                        >
                            <h2 className="mb-4 text-sm font-semibold">
                                계정 관리
                            </h2>

                            <nav className="space-y-1">
                                {ITEMS.map((item) => {
                                    const Icon = item.icon;
                                    const active = pathname === item.href;

                                    return (
                                        <button
                                            key={item.href}
                                            onClick={() => {
                                                router.push(item.href);
                                                onClose();
                                            }}
                                            className={`
                                                w-full flex items-center gap-3 px-3 py-2 rounded text-sm
                                                ${active
                                                ? "bg-accent-soft text-accent font-medium"
                                                : "hover:bg-accent-soft"}
                                            `}
                                        >
                                            <Icon size={18} />
                                            {item.label}
                                        </button>
                                    );
                                })}
                            </nav>

                            <div className="my-4 border-t border-border-light dark:border-border-dark" />

                            <button
                                onClick={() => setConfirmOpen(true)}
                                className="
                                    w-full flex items-center gap-3 px-3 py-2
                                    text-sm rounded
                                    text-text-muted-light dark:text-text-muted-dark
                                    hover:bg-red-500/10 hover:text-red-500
                                "
                            >
                                <LogOut size={18} />
                                로그아웃
                            </button>
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>

            {/* 로그아웃 확인 */}
            <ConfirmDialog
                open={confirmOpen}
                title="로그아웃"
                message="정말 로그아웃 하시겠습니까?"
                confirmText="로그아웃"
                cancelText="취소"
                onConfirm={handleLogoutConfirm}
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
