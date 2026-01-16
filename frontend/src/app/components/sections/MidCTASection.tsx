"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { ArrowRight, Zap, Shield, Users } from "lucide-react";

export default function MidCTASection() {
    const router = useRouter();

    const features = [
        { icon: Zap, text: "30초 내 분석 완료" },
        { icon: Shield, text: "안전한 데이터 관리" },
        { icon: Users, text: "팀 협업 지원" }
    ];

    return (
        <section className="w-full py-28 bg-gradient-to-b from-surface-light to-background-light dark:from-surface-dark dark:to-background-dark relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute inset-0 opacity-30">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent/20 rounded-full blur-3xl" />
            </div>

            <div className="relative z-10 mx-auto max-w-5xl px-6">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7 }}
                    className="text-center"
                >
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/20 text-accent text-sm font-medium mb-8">
                        지금 시작하세요
                    </div>

                    {/* Heading */}
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 tracking-tight">
                        문서 흐름 분석을
                        <br />
                        <span className="bg-gradient-to-r from-accent to-accent-hover bg-clip-text text-transparent">
                            지금 바로 시작하세요
                        </span>
                    </h2>

                    {/* Description */}
                    <p className="text-xl text-text-muted-light dark:text-text-muted-dark mb-10 max-w-2xl mx-auto">
                        회원가입 없이 바로 체험 가능합니다.
                        첫 10건의 분석은 무료로 제공됩니다.
                    </p>

                    {/* CTA Button */}
                    <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="mb-12"
                    >
                        <button
                            onClick={() => router.push("/workspace")}
                            className="group relative h-14 px-8 rounded-xl bg-accent hover:bg-accent-hover text-white font-semibold text-lg shadow-xl shadow-accent/30 transition-all overflow-hidden"
                        >
                            <span className="relative z-10 flex items-center gap-2">
                                무료로 시작하기
                                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                            </span>
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                        </button>
                    </motion.div>

                    {/* Features */}
                    <div className="flex flex-wrap items-center justify-center gap-8">
                        {features.map((feature, index) => {
                            const Icon = feature.icon;
                            return (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 10 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                    className="flex items-center gap-2 text-text-muted-light dark:text-text-muted-dark"
                                >
                                    <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center text-accent">
                                        <Icon size={16} />
                                    </div>
                                    <span className="text-sm font-medium">{feature.text}</span>
                                </motion.div>
                            );
                        })}
                    </div>
                </motion.div>

                {/* Bottom trust indicators */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7, delay: 0.3 }}
                    className="mt-16 pt-8 border-t border-border-light dark:border-border-dark text-center"
                >
                    <p className="text-sm text-text-muted-light dark:text-text-muted-dark">
                        이미 <span className="font-semibold text-accent">2,500+</span>개 팀이 FloCut으로 문서를 분석하고 있습니다
                    </p>
                </motion.div>
            </div>
        </section>
    );
}