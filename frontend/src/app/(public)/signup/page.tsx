"use client";

import SignupForm from "@/app/components/auth/SignupForm";

export default function SignupPage() {
  return (
    <div className="min-h-[calc(100vh-64px)] bg-gradient-to-b from-background-light to-surface-light dark:from-background-dark dark:to-surface-dark flex items-center justify-center px-6 py-20">
      <SignupForm />
    </div>
  );
}
