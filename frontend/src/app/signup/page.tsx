"use client";

import Link from "next/link";

export default function SignupPage() {
  return (
    <div
      className="
        min-h-screen
        flex items-center justify-center
        bg-background-light dark:bg-background-dark
        px-4
      "
    >
      <div
        className="
          w-full max-w-md
          rounded-xl
          border border-border-light dark:border-border-dark
          bg-background-light dark:bg-background-dark
          p-8 sm:p-10
        "
      >
        {/* Title */}
        <h1 className="text-2xl font-bold text-center mb-8">
          회원가입
        </h1>

        {/* Form */}
        <form className="space-y-5">
          {/* Email */}
          <div>
            <label className="block text-sm mb-1">
              이메일
            </label>
            <input
              type="email"
              placeholder="example@email.com"
              className="
                w-full h-11
                rounded-md
                border border-border-light dark:border-border-dark
                bg-background-light dark:bg-background-dark
                px-3 text-sm
                focus:outline-none
                focus:ring-2 focus:ring-accent/40
              "
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm mb-1">
              비밀번호
            </label>
            <input
              type="password"
              placeholder="비밀번호를 입력하세요"
              className="
                w-full h-11
                rounded-md
                border border-border-light dark:border-border-dark
                bg-background-light dark:bg-background-dark
                px-3 text-sm
                focus:outline-none
                focus:ring-2 focus:ring-accent/40
              "
            />
          </div>

          {/* Password Confirm */}
          <div>
            <label className="block text-sm mb-1">
              비밀번호 확인
            </label>
            <input
              type="password"
              placeholder="비밀번호를 다시 입력하세요"
              className="
                w-full h-11
                rounded-md
                border border-border-light dark:border-border-dark
                bg-background-light dark:bg-background-dark
                px-3 text-sm
                focus:outline-none
                focus:ring-2 focus:ring-accent/40
              "
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="
              w-full h-11
              rounded-md
              bg-accent
              hover:bg-accent-hover
              text-white text-sm font-medium
              transition-colors
            "
          >
            회원가입
          </button>
        </form>

        {/* Divider */}
        <div className="my-6 flex items-center gap-3">
          <div className="flex-1 h-px bg-border-light dark:bg-border-dark" />
          <span className="text-xs text-text-muted-light dark:text-text-muted-dark">
            또는
          </span>
          <div className="flex-1 h-px bg-border-light dark:bg-border-dark" />
        </div>

        {/* Social */}
        <button
          className="
            w-full h-11
            rounded-md
            border border-border-light dark:border-border-dark
            text-sm font-medium
            hover:bg-surface-light dark:hover:bg-surface-dark
          "
        >
          Google로 회원가입
        </button>

        {/* Footer */}
        <p className="mt-6 text-sm text-center text-text-muted-light dark:text-text-muted-dark">
          이미 계정이 있으신가요?{" "}
          <Link href="/login" className="text-accent hover:underline">
            로그인
          </Link>
        </p>
      </div>
    </div>
  );
}
