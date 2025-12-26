// app/(admin)/admin/layout.tsx
"use client";

import AdminHeader from "@/app/components/layout/admin/AdminHeader";
import AdminSidebar from "@/app/components/layout/admin/AdminSidebar";

export default function AdminLayout({
                                        children,
                                    }: {
    children: React.ReactNode;
}) {
    return (
        <div className="h-screen flex">
            <AdminSidebar />
            <div className="flex-1 flex flex-col">
                <AdminHeader />
                <main className="flex-1 overflow-y-auto p-6">
                    {children}
                </main>
            </div>
        </div>
    );
}
