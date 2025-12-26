
"use client";

import { ReactNode } from "react";
import { AdminGuard } from "@/provider/AdminGuard";

export default function AdminGroupLayout({
                                             children,
                                         }: {
    children: ReactNode;
}) {
    return <AdminGuard>{children}</AdminGuard>;
}
