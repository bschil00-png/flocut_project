"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import Button from "@/app/components/ui/button/Button";
import Link from "next/link";

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
        <div
            className="
        min-h-screen
        flex flex-col
        bg-background-light dark:bg-background-dark
      "
        >
            {/* 비활성 브랜드 헤더 */}
            <div
                className="
          h-[56px]
          flex items-center
          border-b border-border-light dark:border-border-dark
          px-6
        "
            >
                <div
                    className="
            text-sm font-semibold
            text-text-default-light dark:text-text-default-dark
            opacity-80
            cursor-default
          "
                >
                    FLOCUT
                </div>
            </div>

            {/* 메인 영역 */}
            <div className="flex-1 flex items-center justify-center px-6">
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    className="text-center max-w-md"
                >
                    {/* 상태 코드 */}
                    <p className="text-xs font-medium tracking-wide text-text-muted-light dark:text-text-muted-dark mb-2">
                        500 · INTERNAL ERROR
                    </p>

                    {/* 제목 */}
                    <h1 className="text-xl font-semibold mb-3">
                        문제가 발생했습니다
                    </h1>

                    {/* 설명 */}
                    <p className="text-sm text-text-muted-light dark:text-text-muted-dark leading-relaxed mb-8">
                        일시적인 오류가 발생했습니다.<br />
                        잠시 후 다시 시도해 주세요.
                    </p>

                    {/* 액션 */}
                    <div className="flex items-center justify-center gap-3">
                        <Button variant="primary" onClick={reset}>
                            다시 시도
                        </Button>

                        <Link href="/">
                            <Button variant="secondary">
                                홈으로 이동
                            </Button>
                        </Link>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
