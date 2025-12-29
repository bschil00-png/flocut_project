"use client";

import { AdminGuard } from "@/provider/AdminGuard";
import AdminLayout from "@/app/components/layout/admin/AdminLayout";

export default function AdminRouteLayout({
                                             children,
                                         }: {
    children: React.ReactNode;
}) {
    return (
        <AdminGuard>
            <AdminLayout>
                {children}
            </AdminLayout>
        </AdminGuard>
    );
}
