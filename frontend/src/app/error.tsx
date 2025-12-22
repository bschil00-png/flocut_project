"use client";

import { useEffect } from "react";

export default function ErrorPage({
                                    error,
                                    reset,
                                  }: {
  error: Error;
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

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
          500 ERROR
        </p>

        <h1 className="text-2xl font-bold mb-4">
          문제가 발생했습니다
        </h1>

        <p className="text-sm text-text-muted-light dark:text-text-muted-dark mb-8">
          일시적인 오류입니다.<br />
          잠시 후 다시 시도해주세요.
        </p>

        <div className="flex justify-center gap-3">
          <button
            onClick={reset}
            className="
              h-10 px-5
              rounded-md
              bg-accent
              hover:bg-accent-hover
              text-white text-sm font-medium
            "
          >
            다시 시도
          </button>

          <a
            href="/"
            className="
              h-10 px-5
              flex items-center justify-center
              rounded-md
              border border-border-light dark:border-border-dark
              text-sm font-medium
              hover:bg-surface-light dark:hover:bg-surface-dark
            "
          >
            홈으로 이동
          </a>
        </div>
      </div>
    </div>
  );
}
