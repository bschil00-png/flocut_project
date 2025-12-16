"use client";

import Link from "next/link";

export default function NotFoundPage() {
  return (
    <div className="
      min-h-screen
      flex items-center justify-center
      bg-background-light dark:bg-background-dark
      px-4
    ">
      <div className="
        w-full max-w-md
        rounded-xl
        border border-border-light dark:border-border-dark
        bg-background-light dark:bg-background-dark
        p-10
        text-center
      ">
        <p className="text-sm text-text-muted-light dark:text-text-muted-dark mb-2">
          404 ERROR
        </p>

        <h1 className="text-2xl font-bold mb-4">
          페이지를 찾을 수 없습니다
        </h1>

        <p className="text-sm text-text-muted-light dark:text-text-muted-dark mb-8">
          주소가 잘못되었거나<br />
          페이지가 이동 또는 삭제되었습니다.
        </p>

        <div className="flex justify-center gap-3">
          <Link
            href="/"
            className="
              h-10 px-5
              flex items-center justify-center
              rounded-md
              bg-accent
              hover:bg-accent-hover
              text-white text-sm font-medium
            "
          >
            홈으로 이동
          </Link>

          <button
            onClick={() => history.back()}
            className="
              h-10 px-5
              rounded-md
              border border-border-light dark:border-border-dark
              text-sm font-medium
              hover:bg-surface-light dark:hover:bg-surface-dark
            "
          >
            이전 페이지
          </button>
        </div>
      </div>
    </div>
  );
}
