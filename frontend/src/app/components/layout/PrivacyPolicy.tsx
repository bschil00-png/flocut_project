"use client";

import { motion } from "framer-motion";

export default function PrivacyPolicy() {
    const policies = [
        {
            title: "1. 수집하는 개인정보 항목",
            content: "서비스는 회원가입 및 서비스 제공을 위해 이메일, 이름, 서비스 이용 기록을 수집할 수 있습니다. 업로드된 문서는 분석 목적으로만 사용됩니다."
        },
        {
            title: "2. 개인정보의 이용 목적",
            content: "수집된 정보는 서비스 제공, 사용자 식별, 신규 기능 개발 및 서비스 개선을 위한 통계 데이터로 활용됩니다."
        },
        {
            title: "3. 데이터 보안 및 파기",
            content: "FLOCUT은 사용자의 데이터를 암호화하여 전용 보안 저장소에 저장하며, 사용자가 삭제를 요청하거나 이용 목적이 달성된 경우 즉시 파기합니다."
        }
    ];

    return (
        <div className="min-h-screen bg-background-light dark:bg-background-dark py-24 px-6 transition-colors">
            <div className="max-w-4xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="mb-12"
                >
                    <h1 className="text-3xl md:text-4xl font-bold text-text-primary-light dark:text-text-primary-dark mb-4 tracking-tight">
                        개인정보 처리방침
                    </h1>
                    <p className="text-text-muted-light dark:text-text-muted-dark font-medium">
                        사용자의 소중한 정보를 보호하기 위한 FLOCUT의 개인정보 처리 방침입니다.
                    </p>
                </motion.div>

                <div className="space-y-8">
                    {policies.map((policy, index) => (
                        <motion.section
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.1 * index }}
                            className="bg-surface-light dark:bg-surface-dark rounded-2xl p-8 border border-border-light dark:border-border-dark shadow-sm"
                        >
                            <h2 className="text-xl font-bold text-text-primary-light dark:text-text-primary-dark mb-4">
                                {policy.title}
                            </h2>
                            <p className="text-text-muted-light dark:text-text-muted-dark leading-relaxed font-medium">
                                {policy.content}
                            </p>
                        </motion.section>
                    ))}
                </div>

                <div className="mt-12 text-center">
                    <p className="text-xs text-text-muted-light dark:text-text-muted-dark uppercase tracking-widest font-bold">
                        최종 업데이트: 2026. 01. 16
                    </p>
                </div>
            </div>
        </div>
    );
}