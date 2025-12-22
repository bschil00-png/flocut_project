// src/app/(public)/layout.tsx
import type { Metadata } from "next";
import { cookies } from "next/headers";

import Header from "@/app/components/layout/Header";
import ClientUIShell from "@/app/components/layout/ClientUIShell";

export const metadata: Metadata = {
  title: "FLOCUT",
  description: "문서·음성 기반 AI 요약 플랫폼",
};

export default async function PublicLayout({
                                             children
                                           }: {
  children: React.ReactNode
}) {

  return (
    <>
      <Header  />

      <main className="min-h-screen pt-16">
        <ClientUIShell>
          {children}
        </ClientUIShell>
      </main>
    </>
  );
}
