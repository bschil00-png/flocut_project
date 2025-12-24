"use client";

import { useRouter } from "next/navigation";

export default function WorkspaceHeader() {
    const router = useRouter();

    return (
        <header className="h-14 flex items-center justify-between px-4 border-b">
            <h1 className="text-base font-semibold">FLOCUT WORKSPACE</h1>

            <button
                onClick={() => router.push("/settings/profile")}
                className="w-8 h-8 rounded-full bg-accent text-white flex items-center justify-center"
            >
                F
            </button>
        </header>
    );
}
