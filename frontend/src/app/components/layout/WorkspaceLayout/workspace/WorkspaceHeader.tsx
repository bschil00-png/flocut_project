"use client";

import { useRouter, usePathname } from "next/navigation";
import { ChevronRight, Bell } from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { getAvatarStyle } from "@/app/components/settings/AvatarSelector";

export default function WorkspaceHeader() {
    const router = useRouter();
    const pathname = usePathname();
    const user = useSelector((state: RootState) => state.auth.user);
    const notificationCount = 3;

    const breadcrumbs = getBreadcrumbs(pathname);

    return (
        <header
            className="
                h-14 flex-shrink-0
                bg-background-light dark:bg-background-dark
                border-b border-border-light dark:border-border-dark
                flex items-center justify-between
                px-4 sm:px-6
            "
        >
            {/* Left: Brand + Breadcrumb */}
            <div className="flex items-center gap-3 min-w-0">
                {/* Brand */}
                <button
                    onClick={() => router.push("/")}
                    className="
                        text-sm font-semibold tracking-wide
                        text-text-primary-light dark:text-text-primary-dark
                        hover:opacity-80
                        transition
                    "
                    aria-label="FLOCUT 홈"
                >
                    FLOCUT
                </button>

                <ChevronRight
                    size={14}
                    className="text-text-muted-light dark:text-text-muted-dark"
                />

                {/* Breadcrumb */}
                <nav className="hidden sm:flex items-center gap-1 text-sm overflow-hidden">
                    {breadcrumbs.map((crumb, index) => (
                        <div
                            key={crumb.href}
                            className="flex items-center gap-1 flex-shrink-0"
                        >
                            {index > 0 && (
                                <ChevronRight
                                    size={14}
                                    className="text-text-muted-light dark:text-text-muted-dark"
                                />
                            )}
                            <button
                                onClick={() => router.push(crumb.href)}
                                className={`
                                    px-2 py-1 rounded
                                    transition-colors
                                    ${
                                    index === breadcrumbs.length - 1
                                        ? "text-text-primary-light dark:text-text-primary-dark font-medium"
                                        : "text-text-muted-light dark:text-text-muted-dark hover:text-text-primary-light dark:hover:text-text-primary-dark"
                                }
                                `}
                            >
                                {crumb.label}
                            </button>
                        </div>
                    ))}
                </nav>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-3">
                {/* Notifications */}
                <button
                    className="
                        relative p-2 rounded-md
                        text-text-muted-light dark:text-text-muted-dark
                        hover:bg-surface-light dark:hover:bg-surface-dark
                        hover:text-text-primary-light dark:hover:text-text-primary-dark
                        transition-colors
                    "
                    aria-label="알림"
                >
                    <Bell size={16} />
                    {notificationCount > 0 && (
                        <span
                            className="
                                absolute top-1.5 right-1.5
                                w-1.5 h-1.5
                                bg-red-500 rounded-full
                            "
                        />
                    )}
                </button>

                {/* Profile */}
                <ProfileAvatar user={user} />
            </div>
        </header>
    );
}

function getBreadcrumbs(pathname: string) {
    const paths = pathname.split("/").filter(Boolean);
    const breadcrumbs: Array<{ label: string; href: string }> = [];

    // workspace
    if (paths[0] === "workspace") {
        breadcrumbs.push({ label: "워크스페이스", href: "/workspace" });

        if (paths[1] && !isNaN(Number(paths[1]))) {
            breadcrumbs.push({
                label: `세션 ${paths[1]}`,
                href: `/workspace/${paths[1]}`,
            });
        }

        if (paths[2] === "notes" && paths[3]) {
            breadcrumbs.push({
                label: paths[3] === "new" ? "새 노트" : "노트",
                href: pathname,
            });
        }
    }

    return breadcrumbs;
}

// Profile Avatar (AvatarSelector 기준)
function ProfileAvatar({ user }: { user: any }) {
    const router = useRouter();
    const avatarId = useSelector((state: RootState) => state.ui.avatarId);

    const userName = user?.name || "U";
    const initial = userName.charAt(0).toUpperCase();
    const avatarStyle = getAvatarStyle(avatarId);

    return (
        <button
            onClick={() => router.push("/settings/profile")}
            className={`
                w-8 h-8 rounded-md
                bg-gradient-to-br ${avatarStyle.class}
                text-white text-xs font-semibold
                flex items-center justify-center
                hover:ring-2 hover:ring-accent/30
                transition
            `}
            aria-label="프로필 설정"
        >
            {initial}
        </button>
    );
}
