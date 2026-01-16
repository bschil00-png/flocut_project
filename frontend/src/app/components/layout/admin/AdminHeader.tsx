"use client";

// admin 상단 헤더
// 나중에 검색, 알림, 사용자 메뉴가 들어갈 자리
export default function AdminHeader() {
    return (
        <header className="
      h-16
      border-b border-border-light dark:border-border-dark
      bg-background-light dark:bg-surface-dark
    ">
            <div className="h-full px-6 flex items-center justify-between">
                <div className="text-sm font-semibold">
                    Admin
                </div>

                <div>
                    {/* 추후 우측 메뉴 영역 */}
                </div>
            </div>
        </header>
    );
}
