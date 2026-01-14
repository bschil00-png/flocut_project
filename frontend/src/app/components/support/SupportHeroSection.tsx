"use client";

import { motion } from "framer-motion";
import { Search, MessageSquare } from "lucide-react";

type SupportHeroSectionProps = {
  searchQuery: string;
  onSearchChange: (value: string) => void;
};

export default function SupportHeroSection({ searchQuery, onSearchChange }: SupportHeroSectionProps) {
  return (
    <section className="relative overflow-hidden border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
      <div className="absolute inset-0 opacity-40">
        <div className="absolute top-0 right-0 w-96 h-96 bg-accent/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 py-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/20 text-accent text-sm font-medium mb-6">
            <MessageSquare size={16} />
            <span>고객센터</span>
          </div>

          <h1 className="text-5xl md:text-6xl font-bold mb-4">
            무엇을 도와드릴까요?
          </h1>

          <p className="text-lg text-slate-600 dark:text-slate-400 mb-10 max-w-2xl mx-auto">
            자주 묻는 질문을 확인하거나 직접 문의해주세요
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input
              type="text"
              placeholder="궁금한 내용을 검색해보세요..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}