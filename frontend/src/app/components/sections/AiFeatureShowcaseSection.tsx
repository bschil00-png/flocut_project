"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function HeroSection() {
    const router = useRouter();

    return (
        <section
            className="
        w-full
        pt-28 pb-24
        bg-background-light
        dark:bg-background-dark
      "
        >
            <div className="mx-auto max-w-7xl px-6 grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">

                {/* Left */}
                <div>
                    <motion.h1
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="
              text-4xl md:text-5xl lg:text-6xl
              font-bold leading-tight
              text-text-primary-light
              dark:text-text-primary-dark
              mb-6
            "
                    >
                        여러 문서의 흐름을
                        <br />
                        한 번에 파악하세요
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="
              text-lg
              text-text-muted-light
              dark:text-text-muted-dark
              max-w-xl
              mb-10
            "
                    >
                        FloCut은 문서와 음성을 요약하는 데서 끝나지 않습니다.
                        여러 자료의 변화, 공통점, 누락된 흐름을 분석해
                        판단 가능한 정보로 제공합니다.
                    </motion.p>

                    <motion.button
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.2 }}
                        onClick={() => router.push("/signup")}
                        className="
              h-11 px-8
              rounded-md
              bg-accent hover:bg-accent-hover
              text-white text-sm font-medium
              transition-colors
            "
                    >
                        분석 시작하기
                    </motion.button>
                </div>

                {/* Right – Result Snapshot */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.45, delay: 0.15 }}
                    className="
            rounded-xl
            border border-border-light
            dark:border-border-dark
            bg-surface-light
            dark:bg-surface-dark
            p-6
          "
                >
                    <div className="text-sm font-semibold mb-4">
                        분석 결과 미리보기
                    </div>

                    <div className="space-y-3 text-sm">
                        <Row label="요약 결과" value="핵심 6줄" />
                        <Row label="변경된 내용" value="+3 / -1" accent />
                        <Row label="누락된 항목" value="2개 발견" danger />
                        <Row label="전체 흐름" value="일관성 유지" />
                    </div>

                    <div className="pt-4 text-xs text-text-muted-light">
                        ※ 실제 분석 화면 예시
                    </div>
                </motion.div>
            </div>
        </section>
    );
}

function Row({
                 label,
                 value,
                 accent,
                 danger,
             }: {
    label: string;
    value: string;
    accent?: boolean;
    danger?: boolean;
}) {
    return (
        <div className="flex justify-between">
            <span className="text-text-muted-light">{label}</span>
            <span
                className={`
          font-medium
          ${accent ? "text-accent" : ""}
          ${danger ? "text-red-500" : ""}
        `}
            >
        {value}
      </span>
        </div>
    );
}
