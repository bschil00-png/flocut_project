"use client";

import { motion } from "framer-motion";
import { Search, MessageSquare } from "lucide-react";

type SupportHeroSectionProps = {
    searchQuery: string;
    onSearchChange: (value: string) => void;
};

export default function SupportHeroSection({ searchQuery, onSearchChange }: SupportHeroSectionProps) {
    return (
        <section className="relative overflow-hidden border-b border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark transition-colors">
            {/* Background decoration */}
            <div className="absolute inset-0 opacity-20 pointer-events-none">
                <div className="absolute top-0 right-0 w-96 h-96 bg-accent/20 rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
            </div>

            <div className="relative max-w-7xl mx-auto px-6 py-16 md:py-24 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                >
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/10 border border-accent/20 text-accent text-xs font-bold mb-6 uppercase tracking-widest">
                        <MessageSquare size={14} />
                        <span>Customer Support</span>
                    </div>

                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 tracking-tight text-text-primary-light dark:text-text-primary-dark">
                        무엇을 도와드릴까요?
                    </h1>

                    <p className="text-lg text-text-muted-light dark:text-text-muted-dark mb-10 max-w-2xl mx-auto font-medium">
                        FLOCUT 이용 중 궁금하신 내용을 검색하거나<br className="hidden sm:block" />
                        카테고리별 자주 묻는 질문을 확인해보세요.
                    </p>

                    <div className="max-w-2xl mx-auto relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted-light group-focus-within:text-accent transition-colors" size={20} />
                        <input
                            type="text"
                            placeholder="궁금한 내용을 입력하세요"
                            value={searchQuery}
                            onChange={(e) => onSearchChange(e.target.value)}
                            className="w-full pl-12 pr-4 py-4 rounded-2xl border border-border-light dark:border-border-dark bg-white dark:bg-surface-dark text-text-primary-light dark:text-text-primary-dark placeholder:text-text-muted-light/60 focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all shadow-sm"
                        />
                    </div>
                </motion.div>
            </div>
        </section>
    );
}