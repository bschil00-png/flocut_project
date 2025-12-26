"use client";

import AdminSidebar from "@/app/components/admin/layout/AdminSidebar";

export default function AdminLayout({
                                        children,
                                    }: {
    children: React.ReactNode;
}) {
    return (
        <div className="h-screen flex bg-background-light dark:bg-background-dark">
            {/* 좌측 사이드바 */}
            <AdminSidebar />

            {/* 우측 메인 영역 */}
            <div className="flex flex-1 flex-col overflow-hidden">
                {/* 페이지 콘텐츠 */}
                <main className="flex-1 overflow-y-auto p-8">
                    {children}
                </main>
            </div>
        </div>
    );
}
