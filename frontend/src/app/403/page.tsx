"use client";

import { ReactNode, useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuthActions } from "@/hooks/useAuthActions";
import { AdminGuard } from "@/provider/AdminGuard";
import AdminLayout from "@/app/components/layout/admin/AdminLayout";

export default function AdminRootLayout({
                                            children,
                                        }: {
    children: ReactNode;
}) {
    const { ensureAuth } = useAuthActions();
    const [checking, setChecking] = useState(true);
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        const check = async () => {
            const ok = await ensureAuth();

            if (!ok) {
                router.replace(`/login?from=${pathname}`);
                return;
            }

            setChecking(false);
        };

        check();
    }, []);

    if (checking) {
        return (
            <div className="h-screen flex items-center justify-center">
                <div>인증 확인 중...</div>
            </div>
        );
    }

    return (
        <AdminGuard>
            <AdminLayout>{children}</AdminLayout>
        </AdminGuard>
    );
}
