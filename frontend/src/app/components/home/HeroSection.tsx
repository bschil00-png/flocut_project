"use client";

import {motion} from "framer-motion";
import Button from "@/app/components/ui/button/Button";

import { Variants } from "framer-motion";

const fadeUp: Variants = {
    hidden: {
        opacity: 0,
        y: 20,
    },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 1.1,
            ease: [0.22, 1, 0.36, 1],
        },
    },
};

export default function HeroSection() {
    return (
        <section className="w-full bg-background-light dark:bg-background-dark">
            <div className="mx-auto max-w-7xl px-6 py-32 text-center">

                <motion.div
                    className="select-none pointer-events-none"
                    initial="hidden"
                    animate="visible"
                    variants={fadeUp}
                >
                    <p className="mb-4 text-sm font-medium tracking-wide text-text-muted-light dark:text-text-muted-dark">
                        AI 기반 문서 · 음성 요약 플랫폼
                    </p>

                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-text-primary-light dark:text-text-primary-dark">
                        문서와 음성을,
                        <br />
                        가장 빠르게 이해하는 방법
                    </h1>

                    <p className="mt-6 max-w-2xl mx-auto text-base md:text-lg text-text-muted-light dark:text-text-muted-dark">
                        FLOCUT은 문서와 음성을 AI로 요약해
                        핵심만 남겨주는 지능형 노트 플랫폼입니다.
                    </p>
                </motion.div>

                {/* CTA */}
                <motion.div
                    className="mt-10 flex flex-col sm:flex-row justify-center gap-4"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                        duration: 0.6,
                        delay: 0.15, // 텍스트보다 살짝 늦게
                        ease: [0.22, 1, 0.36, 1],
                    }}
                >
                    <Button size="md" variant="primary">
                        무료로 시작하기
                    </Button>

                    <Button
                        size="md"
                        variant="ghost"
                        className="border border-accent text-accent hover:bg-accent-soft"
                    >
                        기능 둘러보기
                    </Button>
                </motion.div>
            </div>
        </section>
    );
}
