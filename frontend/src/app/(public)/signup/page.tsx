"use client";

import SignupForm from "@/app/components/auth/SignupForm";

export default function SignupPage() {
  return (
    <div
      className="
        min-h-[calc(100vh-64px)]
        bg-background-light dark:bg-background-dark
        flex items-start justify-center
        px-4
        pt-28
      "
    >
      <SignupForm />
    </div>
  );
}
