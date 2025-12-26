"use client";

import { AdminGuard } from "@/provider/AdminGuard";

export default function AdminAccessLayout({
                                              children,
                                          }: {
    children: React.ReactNode;
}) {
    return <AdminGuard>{children}</AdminGuard>;
}
