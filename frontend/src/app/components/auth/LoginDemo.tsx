"use client";

import { motion } from "framer-motion";
import { FileText, Check, TrendingUp } from "lucide-react";

export default function LoginDemo() {
  return (
    <div className="w-full max-w-lg">
      <div className="relative">
        {/* Main Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative p-8 rounded-2xl bg-white dark:bg-surface-dark border border-border-light dark:border-border-dark shadow-2xl overflow-hidden"
        >
          {/* Background gradient */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-accent/10 rounded-full blur-3xl" />

          <div className="relative z-10">
            {/* Header */}
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-border-light dark:border-border-dark">
              <h3 className="text-lg font-bold">실시간 문서 분석</h3>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                <span className="text-xs text-accent font-medium">처리중</span>
              </div>
            </div>

            {/* Analysis Steps */}
            <div className="space-y-4 mb-6">
              {[
                { icon: FileText, label: "문서 업로드 완료", progress: 100, delay: 0 },
                { icon: Check, label: "요약 생성 중", progress: 75, delay: 0.2 },
                { icon: TrendingUp, label: "변화 분석 대기", progress: 0, delay: 0.4 }
              ].map((step, index) => {
                const Icon = step.icon;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: step.delay }}
                    className="flex items-center gap-3"
                  >
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      step.progress === 100
                        ? 'bg-accent text-white'
                        : step.progress > 0
                          ? 'bg-accent/20 text-accent'
                          : 'bg-white dark:bg-background-dark text-text-muted-light dark:text-text-muted-dark border border-border-light dark:border-border-dark'
                    }`}>
                      <Icon size={18} strokeWidth={2} />
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-medium mb-1">{step.label}</div>
                      <div className="h-1.5 bg-white dark:bg-background-dark rounded-full overflow-hidden border border-border-light dark:border-border-dark">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${step.progress}%` }}
                          transition={{ duration: 1.5, delay: step.delay + 0.3 }}
                          className="h-full bg-gradient-to-r from-accent to-accent-hover rounded-full"
                        />
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Results Preview */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="p-4 rounded-xl bg-white dark:bg-background-dark border border-border-light dark:border-border-dark"
            >
              <div className="text-xs text-text-muted-light dark:text-text-muted-dark mb-3">
                예상 결과
              </div>
              <div className="space-y-2">
                {[
                  { label: "요약 완료", value: "6줄", color: "text-accent" },
                  { label: "변경 사항", value: "+3 / -1", color: "text-green-500" },
                  { label: "누락 항목", value: "2개", color: "text-orange-500" }
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.4, delay: 1 + index * 0.1 }}
                    className="flex items-center justify-between text-sm"
                  >
                                        <span className="text-text-muted-light dark:text-text-muted-dark">
                                            {item.label}
                                        </span>
                    <span className={`font-semibold ${item.color}`}>
                                            {item.value}
                                        </span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Decorative elements */}
          <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-blue-500/20 rounded-full blur-2xl" />
        </motion.div>

        {/* Floating cards */}
        <motion.div
          initial={{ opacity: 0, y: 20, rotate: -5 }}
          animate={{ opacity: 1, y: 0, rotate: -3 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="absolute -top-6 -left-6 w-32 h-24 p-3 rounded-xl bg-gradient-to-br from-accent/90 to-accent-hover/90 shadow-lg"
        >
          <div className="text-xs text-white/80 mb-1">처리 속도</div>
          <div className="text-2xl font-bold text-white">5초</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20, rotate: 5 }}
          animate={{ opacity: 1, y: 0, rotate: 3 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="absolute -bottom-6 -right-6 w-32 h-24 p-3 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 shadow-lg"
        >
          <div className="text-xs text-white/80 mb-1">정확도</div>
          <div className="text-2xl font-bold text-white">95%+</div>
        </motion.div>
      </div>
    </div>
  );
}