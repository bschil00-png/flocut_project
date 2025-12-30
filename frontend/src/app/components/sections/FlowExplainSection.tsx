"use client";

import { motion } from "framer-motion";
import { FileText, Sparkles, GitCompare, MessageSquare, ArrowRight } from "lucide-react";

export default function FlowExplainSection() {
    const steps = [
        {
            icon: FileText,
            title: "문서 · 음성 입력",
            description: "PDF, DOCX, TXT 문서와 MP3, WAV 음성 파일을 업로드하세요",
            gradient: "from-blue-500/20 to-cyan-500/20"
        },
        {
            icon: Sparkles,
            title: "핵심 요약 추출",
            description: "LLM 기반으로 문서의 핵심 내용을 3줄 요약과 구조적 문단으로 정리합니다",
            gradient: "from-purple-500/20 to-pink-500/20"
        },
        {
            icon: GitCompare,
            title: "문서 간 변화 비교",
            description: "여러 문서의 추가·삭제·수정 내용을 자동 분석해 변화의 흐름을 파악합니다",
            gradient: "from-orange-500/20 to-red-500/20"
        },
        {
            icon: MessageSquare,
            title: "AI 피드백 제공",
            description: "문서의 논리 구조와 누락된 요소를 분석해 개선 방향을 제안합니다",
            gradient: "from-green-500/20 to-emerald-500/20"
        }
    ];

    return (
        <section className="w-full py-28 bg-gradient-to-b from-background-light to-surface-light dark:from-background-dark dark:to-surface-dark relative">
            <div className="mx-auto max-w-7xl px-6">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <h2 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">
                        문서 분석 프로세스
                    </h2>
                    <p className="text-xl text-text-muted-light dark:text-text-muted-dark">
                        업로드부터 인사이트 도출까지, 자동화된 4단계 워크플로우
                    </p>
                </motion.div>

                {/* Steps Grid */}
                <div className="relative">
                    {/* Connection line */}
                    <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-accent/30 to-transparent -translate-y-1/2" />

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
                        {steps.map((step, index) => {
                            const Icon = step.icon;
                            return (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                    className="group relative"
                                >
                                    <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${step.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl`} />

                                    <div className="relative h-full p-6 rounded-2xl bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark group-hover:border-accent/50 transition-all duration-300 shadow-sm group-hover:shadow-xl group-hover:shadow-accent/10">
                                        {/* Step number badge */}
                                        <div className="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-gradient-to-br from-accent to-accent-hover text-white flex items-center justify-center font-bold text-sm shadow-lg shadow-accent/30">
                                            {index + 1}
                                        </div>

                                        {/* Icon */}
                                        <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-accent/10 to-accent/5 dark:from-accent/20 dark:to-accent/10 flex items-center justify-center text-accent mb-5 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                                            <Icon size={26} strokeWidth={2} />
                                        </div>

                                        {/* Content */}
                                        <h3 className="text-lg font-bold mb-2 group-hover:text-accent transition-colors">
                                            {step.title}
                                        </h3>

                                        <p className="text-sm text-text-muted-light dark:text-text-muted-dark leading-relaxed">
                                            {step.description}
                                        </p>

                                        {/* Arrow indicator */}
                                        {index < steps.length - 1 && (
                                            <div className="hidden lg:flex absolute top-1/2 -right-3 -translate-y-1/2 w-6 h-6 rounded-full bg-accent items-center justify-center shadow-lg shadow-accent/30 z-20">
                                                <ArrowRight size={14} className="text-white" strokeWidth={2.5} />
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>

                {/* Bottom info */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="mt-12 p-6 rounded-xl bg-gradient-to-r from-accent/5 via-accent/10 to-accent/5 border border-accent/20"
                >
                    <div className="flex flex-wrap items-center justify-center gap-8 text-sm">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                            <span className="text-text-muted-light dark:text-text-muted-dark">평균 처리 시간 5초</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-accent animate-pulse" style={{ animationDelay: '0.5s' }} />
                            <span className="text-text-muted-light dark:text-text-muted-dark">200페이지까지 지원</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-accent animate-pulse" style={{ animationDelay: '1s' }} />
                            <span className="text-text-muted-light dark:text-text-muted-dark">무료 체험 가능</span>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}