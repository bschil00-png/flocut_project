"use client";

// 어드민 전용 레이아웃
import AdminHeader from "@/app/components/layout/admin/AdminHeader";
import AdminSidebar from "@/app/components/layout/admin/AdminSidebar";


export default function AdminLayout({children}: {children: React.ReactNode}) {

    return(
        <div className="h-screen flex bg-background-light dark:bg-background-dark">
            <AdminSidebar />

            <div className="flex flex-1 flex-col overflow-hidden">
                <AdminHeader />

                <main className="flex-1 overflow-y-auto p-6">
                    {children}
                </main>
            </div>
        </div>
    );

}