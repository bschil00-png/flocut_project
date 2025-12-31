"use client";

import { ChevronDown, MessageSquare } from "lucide-react";
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
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">
          자주 묻는 질문
        </h2>
        <p className="text-slate-600 dark:text-slate-400">
          {faqs.length}개의 질문이 있습니다
        </p>
      </div>

      {faqs.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
          <MessageSquare className="mx-auto text-slate-300 dark:text-slate-700 mb-4" size={48} />
          <p className="text-slate-600 dark:text-slate-400">
            검색 결과가 없습니다. 다른 키워드로 검색해보세요.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {faqs.map((faq) => (
            <motion.div
              key={faq.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden"
            >
              <button
                onClick={() => onToggleFaq(faq.id)}
                className="w-full flex items-center justify-between p-6 text-left hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
              >
                <span className="font-semibold pr-4">
                  {faq.question}
                </span>
                <ChevronDown
                  className={`flex-shrink-0 text-slate-400 transition-transform ${
                    openFaqId === faq.id ? "rotate-180" : ""
                  }`}
                  size={20}
                />
              </button>

              <AnimatePresence>
                {openFaqId === faq.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-6 text-slate-600 dark:text-slate-400 border-t border-slate-100 dark:border-slate-700 pt-4">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}