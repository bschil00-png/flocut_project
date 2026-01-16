"use client";

import { useState } from "react";
import AdminSidebar from "@/app/components/layout/admin/AdminSidebar";
import { Menu, Bell, Search } from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-background-light dark:bg-background-dark text-text-primary-light dark:text-text-primary-dark font-sans">
      <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex flex-1 flex-col min-w-0 overflow-hidden">
        <header className="h-16 shrink-0 border-b border-border-light dark:border-border-dark bg-white dark:bg-surface-dark sticky top-0 z-[50]">
          <div className="h-full px-4 lg:px-8 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 -ml-2 text-text-muted-light hover:bg-surface-light dark:hover:bg-surface-hover rounded-xl transition-colors"
              >
                <Menu size={24} />
              </button>
              <h2 className="text-sm font-bold hidden sm:block">Admin Management</h2>
            </div>


          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 lg:p-8 custom-scrollbar bg-background-light dark:bg-background-dark">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}