"use client";

import { motion } from "framer-motion";

export default function TermsOfService() {
    const sections = [
        {
            title: "제 1 조 (목적)",
            content: "본 약관은 FLOCUT(이하 '서비스')이 제공하는 AI 문서 요약 및 분석 서비스의 이용 조건 및 절차에 관한 사항을 규정함을 목적으로 합니다."
        },
        {
            title: "제 2 조 (서비스의 제공 및 변경)",
            content: "1. 서비스는 AI를 활용한 문서 요약, 음성 변환, 문서 비교 기능을 제공합니다. 2. 서비스는 기술적 사양의 변경이나 운영상의 사유로 내용을 수정할 수 있습니다."
        },
        {
            title: "제 3 조 (이용자의 의무)",
            content: "이용자는 관계 법령 및 본 약관을 준수해야 하며, 타인의 저작권을 침해하거나 서비스 운영을 방해하는 행위를 해서는 안 됩니다."
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
                        이용약관
                    </h1>
                    <p className="text-text-muted-light dark:text-text-muted-dark font-medium">
                        FLOCUT 서비스를 이용해 주셔서 감사합니다. 본 약관을 주의 깊게 읽어주시기 바랍니다.
                    </p>
                </motion.div>

                <div className="space-y-8">
                    {sections.map((section, index) => (
                        <motion.section
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.1 * index }}
                            className="bg-surface-light dark:bg-surface-dark rounded-2xl p-8 border border-border-light dark:border-border-dark shadow-sm"
                        >
                            <h2 className="text-xl font-bold text-text-primary-light dark:text-text-primary-dark mb-4">
                                {section.title}
                            </h2>
                            <p className="text-text-muted-light dark:text-text-muted-dark leading-relaxed font-medium">
                                {section.content}
                            </p>
                        </motion.section>
                    ))}
                </div>
            </div>
        </div>
    );
}