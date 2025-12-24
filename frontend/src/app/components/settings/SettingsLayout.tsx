"use client";

import SettingsSidebar from "./SettingsSidebar";

export default function SettingsLayout({
                                           children,
                                       }: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex h-full">
            <SettingsSidebar />
            <main className="flex-1 overflow-y-auto p-8">
                {children}
            </main>
        </div>
    );
}
