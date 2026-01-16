"use client";

import { usePathname } from "next/navigation";
import { LayoutDashboard, Users, X } from "lucide-react";
import Link from "next/link";

const adminNavItems = [
  { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { label: "Members", href: "/admin/members", icon: Users },
];

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function AdminSidebar({ isOpen, onClose }: Props) {
  const pathname = usePathname();

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-white dark:bg-surface-dark border-r border-border-light dark:border-border-dark">
      <div className="px-6 py-5 border-b border-border-light dark:border-border-dark flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-accent flex items-center justify-center">
            <span className="text-white font-bold text-lg">F</span>
          </div>
          <div>
            <div className="font-bold text-text-primary-light dark:text-text-primary-dark">FloCut</div>
            <div className="text-[10px] text-text-muted-light dark:text-text-muted-dark uppercase tracking-wider">Admin Console</div>
          </div>
        </div>
        {/* 모바일 닫기 버튼 */}
        <button onClick={onClose} className="lg:hidden p-2 text-text-muted-light hover:bg-surface-light dark:hover:bg-surface-hover rounded-lg">
          <X size={20} />
        </button>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto thin-scrollbar">
        {adminNavItems.map((item) => {
          const active = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={`
                                flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all
                                ${active
                ? "bg-accent text-white shadow-lg shadow-accent/20"
                : "text-text-muted-light dark:text-text-muted-dark hover:bg-surface-light dark:hover:bg-surface-hover hover:text-text-primary-light dark:hover:text-text-primary-dark"}
                            `}
            >
              <item.icon size={18} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-border-light dark:border-border-dark">
        <div className="flex items-center gap-3 p-3 rounded-xl bg-surface-light dark:bg-surface-hover/50 border border-border-light dark:border-border-dark">
          <div className="w-9 h-9 rounded-full bg-accent flex items-center justify-center text-white font-bold">A</div>
          <div className="min-w-0">
            <div className="text-sm font-bold text-text-primary-light dark:text-text-primary-dark truncate">Admin User</div>
            <div className="text-[10px] text-text-muted-light dark:text-text-muted-dark">Super Admin</div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* 데스크탑 사이드바 */}
      <aside className="hidden lg:block w-64 h-screen sticky top-0 shrink-0">
        <SidebarContent />
      </aside>

      {/* 모바일 드로어 */}
      <div className={`fixed inset-0 z-[100] lg:hidden transition-opacity duration-300 ${isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}>
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
        <aside className={`absolute inset-y-0 left-0 w-72 transform transition-transform duration-300 ${isOpen ? "translate-x-0" : "-translate-x-full"}`}>
          <SidebarContent />
        </aside>
      </div>
    </>
  );
}