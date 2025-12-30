"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowRight, Play } from "lucide-react";

export default function HeroSection() {
    const router = useRouter();

    return (
        <section className="relative w-full pt-32 pb-20 bg-gradient-to-b from-background-light to-surface-light dark:from-background-dark dark:to-surface-dark overflow-hidden">
            {/* Animated gradient background */}
            <div className="absolute inset-0 opacity-30">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
            </div>

            <div className="relative z-10 mx-auto max-w-7xl px-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    {/* Left - Content */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                    >
                        {/* Badge */}
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/10 border border-accent/20 text-accent text-sm font-medium mb-6">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
                            </span>
                            AI-Powered Analysis
                        </div>

                        <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.1] mb-6 tracking-tight">
                            <span className="bg-gradient-to-r from-text-primary-light to-text-primary-light/70 dark:from-text-primary-dark dark:to-text-primary-dark/70 bg-clip-text text-transparent">
                                문서의 흐름을
                                <br />
                                한눈에 파악하세요
                            </span>
                        </h1>

                        <p className="text-xl text-text-muted-light dark:text-text-muted-dark mb-8 leading-relaxed max-w-xl">
                            FloCut은 문서와 음성을 분석하고, 여러 자료의 변화와 공통점을 비교하며,
                            AI가 누락된 정보까지 찾아내어 판단 가능한 인사이트를 제공합니다.
                        </p>

                        {/* CTA Buttons */}
                        <div className="flex flex-wrap items-center gap-4">
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => router.push("/signup")}
                                className="group relative h-12 px-6 rounded-lg bg-accent hover:bg-accent-hover text-white font-semibold text-base shadow-lg shadow-accent/25 transition-all overflow-hidden"
                            >
                                <span className="relative z-10 flex items-center gap-2">
                                    무료로 시작하기
                                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                </span>
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                            </motion.button>

                            <button className="h-12 px-6 rounded-lg border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark hover:bg-surface-light dark:hover:bg-surface-dark font-medium transition-colors flex items-center gap-2">
                                <Play size={16} />
                                데모 보기
                            </button>
                        </div>

                        {/* Stats */}
                        <div className="flex items-center gap-8 mt-10 pt-8 border-t border-border-light dark:border-border-dark">
                            <div>
                                <div className="text-2xl font-bold text-accent">5초</div>
                                <div className="text-sm text-text-muted-light dark:text-text-muted-dark">평균 처리 시간</div>
                            </div>
                            <div>
                                <div className="text-2xl font-bold text-accent">95%+</div>
                                <div className="text-sm text-text-muted-light dark:text-text-muted-dark">요약 정확도</div>
                            </div>
                            <div>
                                <div className="text-2xl font-bold text-accent">10+</div>
                                <div className="text-sm text-text-muted-light dark:text-text-muted-dark">지원 포맷</div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Right - Visual Preview */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                        className="relative"
                    >
                        <div className="relative rounded-2xl border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark p-8 shadow-2xl">
                            {/* Mock Analysis Results */}
                            <div className="space-y-4">
                                <div className="flex items-center justify-between pb-4 border-b border-border-light dark:border-border-dark">
                                    <span className="text-sm font-semibold">분석 결과</span>
                                    <span className="text-xs text-accent">실시간 처리중</span>
                                </div>

                                <div className="space-y-3">
                                    <div className="flex items-center justify-between p-3 rounded-lg bg-background-light dark:bg-background-dark">
                                        <span className="text-sm">요약 완료</span>
                                        <span className="text-sm font-semibold text-accent">6줄</span>
                                    </div>

                                    <div className="flex items-center justify-between p-3 rounded-lg bg-background-light dark:bg-background-dark">
                                        <span className="text-sm">변경 사항</span>
                                        <span className="text-sm font-semibold text-green-500">+3 / -1</span>
                                    </div>

                                    <div className="flex items-center justify-between p-3 rounded-lg bg-background-light dark:bg-background-dark">
                                        <span className="text-sm">누락 항목</span>
                                        <span className="text-sm font-semibold text-orange-500">2개 발견</span>
                                    </div>

                                    <div className="flex items-center justify-between p-3 rounded-lg bg-background-light dark:bg-background-dark">
                                        <span className="text-sm">문서 일관성</span>
                                        <span className="text-sm font-semibold text-blue-500">양호</span>
                                    </div>
                                </div>

                                <div className="pt-4 border-t border-border-light dark:border-border-dark">
                                    <div className="text-xs text-text-muted-light dark:text-text-muted-dark mb-2">처리 진행률</div>
                                    <div className="h-2 bg-background-light dark:bg-background-dark rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: "75%" }}
                                            transition={{ duration: 2, delay: 0.5 }}
                                            className="h-full bg-gradient-to-r from-accent to-accent-hover rounded-full"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Floating elements */}
                            <div className="absolute -top-4 -right-4 w-24 h-24 bg-accent/20 rounded-full blur-2xl" />
                            <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-blue-500/20 rounded-full blur-2xl" />
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}