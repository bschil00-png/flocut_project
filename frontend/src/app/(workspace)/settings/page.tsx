"use client";

import { redirect } from "next/navigation";

// /settings 진입 시 기본은 profile
export default function SettingsPage() {
    redirect("/settings/profile");
}
