// src/app/(admin)/admin/layout.tsx
"use client";

import AdminLayout from "@/app/components/layout/admin/AdminLayout";

export default function AdminRootLayout({
                                            children,
                                        }: {
    children: React.ReactNode;
}) {
    return <AdminLayout>{children}</AdminLayout>;
}
