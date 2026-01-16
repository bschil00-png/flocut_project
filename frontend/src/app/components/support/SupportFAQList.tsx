"use client";

import { ChevronDown, MessageSquare, HelpCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type FAQ = {
    id: number;
    category: string;
    question: string;
    answer: string;
};

type SupportFAQListProps = {
    faqs: FAQ[];
    openFaqId: number | null;
    onToggleFaq: (id: number) => void;
};

export default function SupportFAQList({ faqs, openFaqId, onToggleFaq }: SupportFAQListProps) {
    return (
        <div className="animate-fadeIn">
            {/* Header 섹션 - 공용 텍스트 컬러 적용 */}
            <div className="mb-8">
                <h2 className="text-2xl font-bold mb-2 text-text-primary-light dark:text-text-primary-dark tracking-tight">
                    자주 묻는 질문
                </h2>
                <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                    <p className="text-sm font-medium text-text-muted-light dark:text-text-muted-dark uppercase tracking-widest">
                        {faqs.length} Questions Found
                    </p>
                </div>
            </div>

            {faqs.length === 0 ? (
                /* 검색 결과 없음 - 공용 surface 및 border 적용 */
                <div className="text-center py-20 bg-surface-light dark:bg-surface-dark rounded-2xl border border-dashed border-border-light dark:border-border-dark">
                    <HelpCircle className="mx-auto text-text-muted-light/30 dark:text-text-muted-dark/30 mb-4" size={48} strokeWidth={1.5} />
                    <p className="text-text-muted-light dark:text-text-muted-dark font-medium">
                        찾으시는 질문에 대한 검색 결과가 없습니다.
                    </p>
                </div>
            ) : (
                /* FAQ 리스트 */
                <div className="space-y-3">
                    {faqs.map((faq) => {
                        const isOpen = openFaqId === faq.id;

                        return (
                            <motion.div
                                key={faq.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className={`bg-white dark:bg-surface-dark rounded-2xl border transition-all duration-300 ${
                                    isOpen
                                        ? "border-accent/40 shadow-xl shadow-accent/5"
                                        : "border-border-light dark:border-border-dark hover:border-accent/30"
                                }`}
                            >
                                <button
                                    onClick={() => onToggleFaq(faq.id)}
                                    className="w-full flex items-center justify-between p-6 text-left group"
                                >
                                    <div className="flex items-start gap-4 flex-1 min-w-0">
                                        {/* 질문 아이콘 - 사용자 친화적 포인트 */}
                                        <span className={`mt-1 font-bold text-sm ${isOpen ? "text-accent" : "text-text-muted-light"}`}>
                      Q.
                    </span>
                                        <span className={`font-bold transition-colors ${
                                            isOpen ? "text-accent" : "text-text-primary-light dark:text-text-primary-dark group-hover:text-accent"
                                        }`}>
                      {faq.question}
                    </span>
                                    </div>
                                    <div className={`p-1.5 rounded-full transition-all ${
                                        isOpen ? "bg-accent text-white" : "text-text-muted-light bg-surface-light dark:bg-surface-hover"
                                    }`}>
                                        <ChevronDown
                                            className={`transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
                                            size={18}
                                            strokeWidth={2.5}
                                        />
                                    </div>
                                </button>

                                <AnimatePresence>
                                    {isOpen && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: "auto", opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                                            className="overflow-hidden"
                                        >
                                            {/* 답변 영역 - 시각적으로 분리된 배경색 적용 */}
                                            <div className="px-6 pb-6 pt-2">
                                                <div className="p-5 rounded-xl bg-surface-light/50 dark:bg-background-dark/50 border border-border-light dark:border-border-dark text-text-muted-light dark:text-text-muted-dark leading-relaxed font-medium">
                                                    <div className="flex gap-4">
                                                        <span className="font-bold text-accent text-sm shrink-0">A.</span>
                                                        <p className="text-[15px] whitespace-pre-line">
                                                            {faq.answer}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}