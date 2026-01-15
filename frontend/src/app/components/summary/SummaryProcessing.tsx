"use client";

import { Sparkles, Clock } from "lucide-react";
import { motion } from "framer-motion";

export default function SummaryProcessing() {
    return (
        <div className="flex flex-col items-center justify-center py-16 px-4">
            {/* 애니메이션 아이콘 */}
            <motion.div
                animate={{
                    scale: [1, 1.2, 1],
                    rotate: [0, 360],
                }}
                transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
                className="w-20 h-20 mb-6 rounded-full bg-gradient-to-br from-accent/20 to-accent/5 flex items-center justify-center"
            >
                <Sparkles size={36} className="text-accent" />
            </motion.div>

            {/* 제목 */}
            <h3 className="text-lg font-semibold text-text-primary-light dark:text-text-primary-dark mb-2">
                AI 요약 생성 중
            </h3>

            {/* 설명 */}
            <p className="text-sm text-text-muted-light dark:text-text-muted-dark text-center max-w-md mb-6">
                문서를 분석하고 핵심 내용을 요약하고 있습니다.
                <br />
                잠시만 기다려주세요.
            </p>

            {/* 프로그레스 바 */}
            <div className="w-full max-w-xs">
                <div className="h-2 bg-surface-light dark:bg-surface-dark rounded-full overflow-hidden">
                    <motion.div
                        className="h-full bg-accent"
                        animate={{
                            x: ["-100%", "100%"],
                        }}
                        transition={{
                            duration: 1.5,
                            repeat: Infinity,
                            ease: "easeInOut",
                        }}
                        style={{ width: "50%" }}
                    />
                </div>
            </div>

            {/* 예상 시간 */}
            <div className="mt-6 flex items-center gap-2 text-xs text-text-muted-light dark:text-text-muted-dark">
                <Clock size={14} />
                <span>평균 20~50초 소요</span>
            </div>
        </div>
    );
}