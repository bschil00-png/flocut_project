"use client";

import { motion } from "framer-motion";
import { Check, TrendingUp, Users, FileCheck, Share2 } from "lucide-react";

export default function ReplaceWorkSection() {
    const useCases = [
        {
            icon: FileCheck,
            title: "회차별 문서 변경점 검토",
            description: "문서 버전 간 차이를 자동으로 추적하고 변경 이력을 시각화합니다",
            color: "from-blue-500 to-cyan-500"
        },
        {
            icon: TrendingUp,
            title: "회의 내용 흐름 비교",
            description: "여러 회의록을 비교해 의사결정 과정과 논의 흐름을 분석합니다",
            color: "from-purple-500 to-pink-500"
        },
        {
            icon: Check,
            title: "보고서 논점 누락 확인",
            description: "AI가 문서의 논리 구조를 분석해 빠진 내용을 자동으로 감지합니다",
            color: "from-orange-500 to-red-500"
        },
        {
            icon: Share2,
            title: "팀 공유용 분석 결과 생성",
            description: "분석 결과를 팀원들과 공유 가능한 형태로 자동 생성합니다",
            color: "from-green-500 to-emerald-500"
        }
    ];

    return (
        <section className="w-full py-28 bg-surface-light dark:bg-surface-dark relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-accent/5 rounded-full blur-3xl" />

            <div className="relative z-10 mx-auto max-w-7xl px-6">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="max-w-3xl mb-16"
                >
                    <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">
                        이런 상황에서
                        <br />
                        <span className="bg-gradient-to-r from-accent to-accent-hover bg-clip-text text-transparent">
                            FloCut이 필요합니다
                        </span>
                    </h2>

                    <p className="text-xl text-text-muted-light dark:text-text-muted-dark leading-relaxed">
                        회의록, 보고서, 기획 문서처럼 여러 문서를 반복해서 검토해야 하는 업무에서
                        FloCut은 본질을 드러내는 분석 도구로 작동합니다.
                    </p>
                </motion.div>

                {/* Use Cases Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {useCases.map((useCase, index) => {
                        const Icon = useCase.icon;
                        return (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                className="group relative"
                            >
                                <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${useCase.color} opacity-0 group-hover:opacity-20 transition-opacity duration-500 blur-xl`} />

                                <div className="relative h-full p-8 rounded-2xl bg-background-light dark:bg-background-dark border border-border-light dark:border-border-dark group-hover:border-accent/50 transition-all duration-300 shadow-sm group-hover:shadow-xl group-hover:shadow-accent/10">
                                    {/* Icon with gradient border */}
                                    <div className="flex items-start gap-4 mb-4">
                                        <div className={`relative w-12 h-12 rounded-xl bg-gradient-to-br ${useCase.color} p-0.5 flex-shrink-0 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300`}>
                                            <div className="w-full h-full rounded-xl bg-background-light dark:bg-background-dark flex items-center justify-center">
                                                <Icon size={22} className="text-accent" strokeWidth={2} />
                                            </div>
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="text-lg font-bold mb-1 group-hover:text-accent transition-colors">
                                                {useCase.title}
                                            </h3>
                                        </div>
                                    </div>

                                    {/* Description */}
                                    <p className="text-sm text-text-muted-light dark:text-text-muted-dark leading-relaxed pl-16">
                                        {useCase.description}
                                    </p>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>

                {/* Stats Bar */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="mt-12 p-8 rounded-2xl bg-gradient-to-r from-accent/5 via-accent/10 to-accent/5 border border-accent/20 shadow-lg"
                >
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            { value: "2,500+", label: "처리된 문서" },
                            { value: "15,000+", label: "분석 완료" },
                            { value: "98%", label: "사용자 만족도" }
                        ].map((stat, index) => (
                            <div key={index} className="text-center md:text-left">
                                <div className="text-4xl font-bold bg-gradient-to-r from-accent to-accent-hover bg-clip-text text-transparent mb-2">
                                    {stat.value}
                                </div>
                                <div className="text-sm text-text-muted-light dark:text-text-muted-dark font-medium">
                                    {stat.label}
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </section>
    );
}