"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { ChevronRight, HelpCircle, ArrowUpRight, Eye } from "lucide-react";

export default function SupportSection() {
    const router = useRouter();

    const faqs = [
        {
            question: "FloCut AI 분석 기능은 어떻게 작동하나요?",
            date: "2025.12.28",
            views: "1.2K"
        },
        {
            question: "문서 비교 기능에서 지원하는 파일 형식은?",
            date: "2025.12.25",
            views: "856"
        },
        {
            question: "음성 파일 업로드 시 주의사항",
            date: "2025.12.20",
            views: "623"
        }
    ];

    return (
        <section className="w-full py-28 bg-background-light dark:bg-background-dark">
            <div className="mx-auto max-w-6xl px-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left - Header */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="lg:col-span-1"
                    >
                        <div className="sticky top-24">
                            {/* Icon */}
                            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-accent/20 to-accent/10 flex items-center justify-center text-accent mb-6 shadow-lg shadow-accent/10">
                                <HelpCircle size={32} strokeWidth={2} />
                            </div>

                            <h3 className="text-3xl font-bold mb-4 tracking-tight">
                                자주 묻는 질문
                            </h3>

                            <p className="text-text-muted-light dark:text-text-muted-dark mb-6 leading-relaxed">
                                FloCut 사용에 대해 궁금한 점이 있으신가요?
                                가장 많이 묻는 질문들을 확인해보세요.
                            </p>

                            <button
                                onClick={() => router.push("/support")}
                                className="group inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-accent/10 hover:bg-accent/20 text-accent font-medium transition-all"
                            >
                                전체 FAQ 보기
                                <ArrowUpRight size={16} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                            </button>
                        </div>
                    </motion.div>

                    {/* Right - FAQ List */}
                    <div className="lg:col-span-2 space-y-4">
                        {faqs.map((faq, index) => (
                            <motion.button
                                key={index}
                                initial={{ opacity: 0, x: 20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                onClick={() => router.push("/support")}
                                className="group w-full p-6 rounded-xl bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark hover:border-accent/50 transition-all duration-300 text-left shadow-sm hover:shadow-lg hover:shadow-accent/10"
                            >
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex-1">
                                        <h4 className="text-lg font-semibold mb-3 group-hover:text-accent transition-colors">
                                            {faq.question}
                                        </h4>
                                        <div className="flex items-center gap-4 text-sm text-text-muted-light dark:text-text-muted-dark">
                                            <span className="flex items-center gap-1.5">
                                                <div className="w-1.5 h-1.5 rounded-full bg-accent" />
                                                {faq.date}
                                            </span>
                                            <span className="flex items-center gap-1.5">
                                                <Eye size={14} />
                                                {faq.views}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center text-accent group-hover:bg-accent group-hover:text-white transition-all flex-shrink-0">
                                        <ChevronRight size={18} className="group-hover:translate-x-0.5 transition-transform" strokeWidth={2.5} />
                                    </div>
                                </div>
                            </motion.button>
                        ))}

                        {/* Need more help card */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: 0.3 }}
                            className="relative p-8 rounded-2xl bg-gradient-to-br from-accent/10 via-accent/5 to-transparent border border-accent/30 shadow-lg overflow-hidden mt-6"
                        >
                            <div className="absolute top-0 right-0 w-32 h-32 bg-accent/20 rounded-full blur-3xl" />

                            <div className="relative z-10">
                                <h4 className="text-xl font-bold mb-2">더 도움이 필요하신가요?</h4>
                                <p className="text-sm text-text-muted-light dark:text-text-muted-dark mb-6">
                                    1:1 문의를 통해 빠른 답변을 받아보세요
                                </p>
                                <button
                                    onClick={() => router.push("/support")}
                                    className="h-11 px-6 rounded-lg bg-accent hover:bg-accent-hover text-white font-semibold transition-all shadow-lg shadow-accent/25"
                                >
                                    문의하기
                                </button>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    );
}